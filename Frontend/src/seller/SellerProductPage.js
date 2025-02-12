import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlusCircle } from "react-icons/fa";

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    let sellerId = JSON.parse(localStorage.getItem("user"))?.userId;
    axios
      .get(`https://quicktradehub.in/productservice/products/seller/${sellerId}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios
        .delete(`http://localhost:3000/products/${productId}`)
        .then(() => {
          setProducts(products.filter((product) => product._id !== productId));
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
        });
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Your Products</h1>
        <button
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-200"
          onClick={() => navigate("/seller/add-product")}
        >
          <FaPlusCircle className="mr-2" /> Add New Product
        </button>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-200"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {product.title}
              </h2>
              <p className="text-gray-600 mt-2">₹{product.price}</p>
              <div className="flex justify-between items-center mt-4">
                <button
                  className="flex items-center text-yellow-500 hover:text-yellow-600"
                  onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button
                  className="flex items-center text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(product._id)}
                >
                  <FaTrashAlt className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-8">
          <p>No products found. Start by adding a new product!</p>
        </div>
      )}
    </div>
  );
};

export default SellerProductsPage;
