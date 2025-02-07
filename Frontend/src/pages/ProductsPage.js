import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);

  useEffect(() => {
    fetchProducts();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProducts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await fetch(`http://13.49.132.61:3000/products?limit=6&page=${page}`);
      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      !loading
    ) {
      fetchProducts();
    }
  }, [loading]);

  const handleAddToWishlist = (product) => {
    const isProductInWishlist = wishlist.items.some((item) => item._id === product._id);
    if (isProductInWishlist) {
      dispatch(removeFromWishlist(product));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const isInWishlist = (product) => {
    return wishlist.items.some((item) => item._id === product._id);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`http://13.49.132.61:3000/products/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (productId) => {
    console.log(`Edit product with ID: ${productId}`);
  };

  return (
    <div className="p-6 bg-red-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-red-800 mb-8">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onAddToWishlist={handleAddToWishlist}
            isInWishlist={isInWishlist(product)}
          />
        ))}
      </div>
      {loading && <LoadingSpinner />}
      {!hasMore && <p className="text-center text-red-600 mt-4">No more products to load.</p>}
    </div>
  );
};

export default ProductsPage;
