import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);

  useEffect(() => {
    fetchProducts();
  }, [page]); // Fetch products when `page` changes

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  const fetchProducts = async () => {
    if (loading || !hasMore) {
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        `https://quicktradehub.in/productservice/products?limit=6&page=${page}`
      );
      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        // Prevent duplicates
        setProducts((prevProducts) => {
          const newProducts = data.filter(
            (product) =>
              !prevProducts.some(
                (prevProduct) => prevProduct._id === product._id
              )
          );
          return [...prevProducts, ...newProducts];
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const handleScroll = useCallback(
    debounce(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage((prevPage) => prevPage + 1); // Increment page number
      }
    }, 300),
    [loading, hasMore]
  );

  const handleAddToWishlist = (product) => {
    const isProductInWishlist = wishlist.items.some(
      (item) => item._id === product._id
    );
    if (isProductInWishlist) {
      dispatch(removeFromWishlist(product));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const isInWishlist = (product) =>
    wishlist.items.some((item) => item._id === product._id);

  return (
    <div className="p-6 bg-red-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-red-800 mb-8">
        Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToWishlist={handleAddToWishlist}
            isInWishlist={isInWishlist(product)}
          />
        ))}
      </div>
      {loading && <LoadingSpinner />}
      {!hasMore && (
        <p className="text-center text-red-600 mt-4">
          No more products to load.
        </p>
      )}
    </div>
  );
};

export default ProductsPage;
