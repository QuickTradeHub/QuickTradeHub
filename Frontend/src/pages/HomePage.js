import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);  // Page state for pagination
  const [loadingMore, setLoadingMore] = useState(false);  // For loading additional products
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Set to true when initial load starts
      try {
        const res = await axios.get(`https://fakestoreapi.com/products?limit=12&page=${page}`);
        
        if (res.data.length > 0) {
          // Check if products are being fetched for the first page or subsequent pages
          if (page === 1) {
            setProducts(res.data);  // Load the first set of products
          } else {
            setProducts((prevProducts) => [...prevProducts, ...res.data]); // Append new products
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);  // Set to false once loading is complete
        setLoadingMore(false);  // Reset loadingMore after fetching products
      }
    };

    fetchProducts();
  }, [page]);  // Triggered when the page state changes

  const handleAuth = () => {
    dispatch(setUser(user ? null : { name: "John Doe", email: "john@example.com" }));
    navigate(user ? "/login" : "/profile");
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const loadMoreProducts = () => {
    setLoadingMore(true);  // Set loading for additional products
    setPage((prevPage) => prevPage + 1);  // Increment page number to fetch more products
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} handleAuth={handleAuth} />
      <div className="container-fluid p-4">
        <h2 className="text-lg font-semibold mb-4">Top Deals</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading && page === 1 ? (
            <p className="col-span-full text-center">Loading...</p> // Show loader only during initial load
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
            <button className="btn btn-primary" disabled>Loading more...</button> // Show loader for "Load More"
          ) : (
            <button onClick={loadMoreProducts} className="btn btn-primary">
              Load More
            </button>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
