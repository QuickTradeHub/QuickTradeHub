import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, setCartItems } from "../redux/cartSlice"; // Import setCartItems action
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaStar, FaShoppingCart, FaDollarSign, FaCheck } from "react-icons/fa";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // Access cart items from Redux
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    // Load cart from localStorage when component mounts
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    dispatch(setCartItems(storedCart)); // Update Redux store with persisted cart data
  }, [dispatch]);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const isProductInCart = cartItems.some((item) => item.id === parseInt(productId));

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://fakestoreapi.com/products/${productId}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const emptyStars = 5 - filledStars;
    return (
      <>
        {[...Array(filledStars)].map((_, index) => (
          <FaStar key={`filled-${index}`} className="text-yellow-500" />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <FaStar key={`empty-${index}`} className="text-gray-300" />
        ))}
      </>
    );
  };

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(product.id));
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (!product) return <div className="text-center p-4">Product not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row p-6">
            <div className="flex md:w-1/2 justify-center items-center space-x-4">
              <img src={product.image} alt={product.title} className="w-64 h-64 object-contain rounded-lg shadow-lg" />
            </div>
            <div className="md:w-1/2 space-y-4 mt-4 md:mt-0">
              <h2 className="text-4xl font-semibold text-gray-800">{product.title}</h2>
              <p className="text-lg font-medium text-gray-600">{product.category}</p>
              <div className="flex items-center space-x-2 text-xl">
                {renderStars(product.rating.rate)}
                <span className="text-gray-600">({product.rating.count} reviews)</span>
              </div>
              <p className="text-lg text-gray-700">{product.description}</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={isProductInCart ? handleRemoveFromCart : handleAddToCart}
                    className={`bg-blue-600 text-white py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 flex items-center space-x-2 ${
                      isProductInCart ? "bg-green-600" : ""
                    }`}
                  >
                    <FaShoppingCart />
                    <span>{isProductInCart ? "Remove from Cart" : "Add to Cart"}</span>
                    {isProductInCart && <FaCheck className="text-white ml-2" />}
                  </button>
                  <button className="bg-green-600 text-white py-3 px-8 rounded-lg shadow-md hover:bg-green-700 transition duration-300 flex items-center space-x-2">
                    <FaDollarSign />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
