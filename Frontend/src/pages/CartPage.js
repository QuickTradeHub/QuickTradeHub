import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, clearCart } from '../redux/cartSlice';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const cart = useSelector((state) => state.cart.items); // Accessing cart items from Redux

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    history('/checkout'); // Redirecting to checkout page
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <h1 className="text-center text-5xl font-bold text-gray-900 mb-10">Your Shopping Cart</h1>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        {cart.length === 0 ? (
          <div className="text-center text-xl text-gray-600">
            <p>Your cart is currently empty.</p>
            <p className="mt-4 text-lg">Browse products and add some to your cart!</p>
          </div>
        ) : (
          <div>
            {/* Cart Items */}
            {cart.map((item) => (
              <div
                key={item.id} // Ensure unique key for each item
                className="border-b pb-4 mb-6 flex justify-between items-center hover:bg-gray-50 transition duration-200"
              >
                <div className="flex items-center">
                  <img
                    src={item.image ? item.image : ''} // Ensure image is a valid string
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-lg"
                  />
                  <div className="ml-6">
                    <h2 className="text-2xl font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-gray-600 text-sm">Category: {item.category}</p>
                    <p className="text-gray-500 text-sm mt-2">{item.description ? item.description.toString() : ''}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-lg font-semibold text-gray-800">
                    ₹{(item.price * 80 * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <button
                    onClick={() => handleRemoveFromCart(item)}
                    className="mt-3 text-red-500 hover:text-red-700 flex items-center transition duration-200"
                  >
                    <FaTrashAlt className="mr-1" /> Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Cart Total and Actions */}
            <div className="flex justify-between items-center mt-8">
              <div className="text-2xl font-semibold text-gray-900">
                <p>Total: ₹{(total * 80).toFixed(2)}</p>
                <p className="text-lg text-gray-600">({cart.length} items)</p>
              </div>
              <div>
                <button
                  onClick={handleClearCart}
                  className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition duration-300 transform hover:scale-105"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => history('/')}
                className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-105"
              >
                Continue Shopping
              </button>

              <button
                onClick={handleProceedToCheckout}
                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
