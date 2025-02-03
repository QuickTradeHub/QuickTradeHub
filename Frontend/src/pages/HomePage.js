import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://fakestoreapi.com/products?limit=12&page=${page}`);
        if (res.data.length > 0) {
          setProducts((prevProducts) => (page === 1 ? res.data : [...prevProducts, ...res.data]));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchProducts();
  }, [page]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const loadMoreProducts = () => {
    setLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="text-lg font-semibold mb-4">Top Deals</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading && page === 1 ? (
          <p className="col-span-full text-center">Loading...</p>
        ) : (
          products.map((p) => (
            <div key={p.id} onClick={() => handleProductClick(p.id)}>
              <ProductCard product={p} />
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex justify-center">
        {loadingMore ? (
          <button className="btn btn-primary" disabled>Loading more...</button>
        ) : (
          <button onClick={loadMoreProducts} className="btn btn-primary">
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
