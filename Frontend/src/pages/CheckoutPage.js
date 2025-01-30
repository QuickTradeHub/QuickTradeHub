import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaPen } from 'react-icons/fa';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [addresses, setAddresses] = useState([
    '123 Main Street, City A',
    '456 Elm Street, City B',
    '789 Oak Avenue, City C',
  ]);
  const [newAddress, setNewAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    // Place the order logic here
    setOrderPlaced(true);
    dispatch(clearCart()); // Clear the cart after placing the order
  };

  const handleAddAddress = () => {
    if (newAddress && !addresses.includes(newAddress)) {
      setAddresses([...addresses, newAddress]);
      setNewAddress('');
    }
  };

  const handleEditAddress = (index) => {
    setIsEditing(true);
    setNewAddress(addresses[index]);
    setEditIndex(index);
  };

  const handleSaveAddress = () => {
    if (newAddress && !addresses.includes(newAddress)) {
      const updatedAddresses = [...addresses];
      updatedAddresses[editIndex] = newAddress;
      setAddresses(updatedAddresses);
      setNewAddress('');
      setIsEditing(false);
      setEditIndex(null);
    }
  };

  const handleDeleteAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
    if (selectedAddress === addresses[index]) {
      setSelectedAddress('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <h1 className="text-center text-5xl font-bold text-gray-900 mb-10">Checkout</h1>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        {/* Address Selection */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Select Address</h2>
          <div className="mt-2">
            {addresses.map((address, index) => (
              <div key={index} className="flex items-center space-x-4 mb-2">
                <input
                  type="radio"
                  name="address"
                  value={address}
                  checked={selectedAddress === address}
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="h-4 w-4"
                />
                <span className="text-gray-800">{address}</span>
                <FaPen
                  className="text-blue-600 cursor-pointer ml-2"
                  onClick={() => handleEditAddress(index)}
                />
                <FaTrashAlt
                  className="text-red-600 cursor-pointer ml-2"
                  onClick={() => handleDeleteAddress(index)}
                />
              </div>
            ))}
            <div className="mt-4">
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Add a new address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddAddress}
                className="mt-2 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Add Address
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center mt-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg mr-4"
              />
              <div>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-gray-600">Price: ${item.price}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-600">
                  Subtotal: ${item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
          <hr className="my-4 border-gray-300" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span className="text-green-600">${total}</span>
          </div>
        </div>

        {/* Order Placement */}
        {orderPlaced ? (
          <div className="text-center text-xl font-semibold text-green-600">
            Your order has been placed successfully!
          </div>
        ) : (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => history.push('/cart')}
              className="bg-yellow-500 text-white py-2 px-6 rounded-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-105"
            >
              Back to Cart
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={!selectedAddress}
              className={`bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105 ${!selectedAddress ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
