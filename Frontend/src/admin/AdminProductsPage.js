import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`https://quicktradehub.in/productservice/products/?limit=6&page=${page}`);
      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, ...(data || [])]);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 && !loading
      ) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const deleteProduct = async (productId) => {
    try {
      await fetch(`https://quicktradehub.in/productservice/products/${productId}`, {
        method: "DELETE",
      });
      setProducts((prevProducts) => prevProducts.filter(product => product._id !== productId));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  useEffect(() => {
    document.title = "Admin Product Dashboard - QuickTradeHub";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 sm:mb-10 drop-shadow-lg">
          Admin Product Dashboard
        </h1>
        {loading && products.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-2xl text-white animate-pulse">Loading products...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="bg-white shadow-xl rounded-3xl overflow-hidden transform hover:scale-105 transition duration-500">
                  <img
                    src={product.thumbnail}
                    alt={`Thumbnail for ${product.title}`}
                    className="w-full h-48 sm:h-52 object-cover"
                  />
                  <div className="p-4 sm:p-5">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2 truncate">
                      {product.title}
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <p className="text-lg sm:text-xl font-bold text-green-500">
                        ₹{product.price}
                      </p>
                      <span className="text-xs font-semibold text-white bg-blue-500 px-2 py-1 rounded-lg">
                        {product.condition}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500">
                      <span>Stock: {product.stock}</span>
                      <span>Rating: {product.rating}</span>
                    </div>
                    <button
                      onClick={() => {navigate(`/admin/products/seller/${product.sellerId}`)}}
                      className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 sm:py-3 rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
                    >
                      View Seller Info
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="mt-2 w-full bg-red-500 text-white py-2 sm:py-3 rounded-xl hover:bg-red-600 transition-all duration-300"
                    >
                      Delete Product
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-white text-2xl">No products found.</div>
            )}
          </div>
        )}
        {loading && products.length > 0 && (
          <div className="flex justify-center items-center mt-4">
            <div className="text-white text-lg animate-pulse">Loading more products...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductPage;
