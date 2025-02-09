import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeItem } from '../redux/cartSlice';
import { Plus, Minus, X, ShoppingCart, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();  // For navigation

  const handleCheckout = () => {
    navigate('/order-summary', { state: { products: cartItems } });  // Pass cart items as state
  };

  const handleIncrement = (itemId) => {
    dispatch(incrementQuantity(itemId));
  };

  const handleDecrement = (itemId) => {
    dispatch(decrementQuantity(itemId));
  };

  const handleRemove = (itemId) => {
    dispatch(removeItem(itemId));
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center mb-8 sm:mb-10 text-gray-800 flex items-center justify-center gap-3">
        <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" /> Your Cart
      </h1>
      {cartItems.length === 0 ? (
        <div className="text-center text-xl sm:text-2xl text-gray-500">Your cart is empty.</div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row items-center bg-white shadow-lg rounded-2xl overflow-hidden p-4 sm:p-6">
              <img src={item.thumbnail} alt={item.title} className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xl" />
              <div className="flex-1 mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{item.title}</h2>
                <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex justify-center sm:justify-between items-center">
                  <span className="text-lg sm:text-xl font-bold text-indigo-600">₹{item.price}</span>
                  <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                    <button 
                      onClick={() => handleDecrement(item._id)} 
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => handleIncrement(item._id)} 
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleRemove(item._id)} 
                className="mt-4 sm:mt-0 sm:ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200">
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <div className="p-4 sm:p-6 bg-white shadow-lg rounded-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Order Summary</h2>
            <div className="flex justify-between text-base sm:text-lg mb-3 sm:mb-4">
              <span>Subtotal</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base sm:text-lg mb-3 sm:mb-4">
              <span>Shipping</span>
              <span>₹40.00</span>
            </div>
            <div className="flex justify-between text-lg sm:text-xl font-bold border-t pt-3 sm:pt-4">
              <span>Total</span>
              <span>₹{(totalAmount + 40).toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout}
              className="mt-5 sm:mt-6 w-full bg-indigo-600 text-white text-base sm:text-lg py-3 rounded-xl shadow-md hover:bg-indigo-700 transition duration-200">
              Proceed to Checkout
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
