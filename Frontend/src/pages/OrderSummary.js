import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const OrderSummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const products = location.state?.products || [];
  const totalAmount = products.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [user, setUser] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Fetch user from localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      alert('You need to log in first.');
      navigate('/login');  // Redirect to login if user not found
    } else {
      setUser(storedUser);
      // Select the primary address by default if it exists
      const primaryAddress = storedUser.addresses?.find(address => address.isPrimary);
      setSelectedAddress(primaryAddress || storedUser.addresses?.[0]);
    }
  }, [navigate]);

  // Handle placing the order
  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      alert('Please select or add a shipping address.');
      return;
    }
    alert('Order placed successfully!');
  };

  // Navigate to add address page (or open modal)
  const handleAddAddress = () => {
    navigate('/add-address', { state: { userId: user.userId } });
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">Order Summary</h1>

      {/* User Info */}
      {user && (
        <div className="max-w-lg mx-auto mb-6 p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Customer Details</h2>
          <p className="mb-2 text-gray-700"><strong>Name:</strong> {`${user.firstName} ${user.lastName}`}</p>
          <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      {/* Shipping Address */}
      <div className="max-w-lg mx-auto mb-6 p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Shipping Address</h2>
        {user && user.addresses && user.addresses.length > 0 ? (
          <div>
            {user.addresses.map((address) => (
              <div
                key={address.addressId}
                className={`p-4 mb-3 border rounded-lg cursor-pointer transition duration-300 ease-in-out ${
                  selectedAddress?.addressId === address.addressId
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300'
                }`}
                onClick={() => setSelectedAddress(address)}
              >
                <p className="text-gray-800">{address.street}</p>
                <p className="text-gray-600">{address.city}, {address.state} - {address.zipCode}</p>
                <p className="text-gray-600">{address.country}</p>
                {address.isPrimary && <span className="text-sm text-green-500 font-semibold">Primary Address</span>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mb-4">No address found. Please add a shipping address.</p>
        )}

        <button 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow-lg transition"
          onClick={handleAddAddress}
        >
          Add Address
        </button>
      </div>

      {/* Products Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          {products.map((item) => (
            <div key={item._id} className="flex items-center p-4 bg-white rounded-lg shadow-lg mb-4 transition duration-300 ease-in-out">
              <img src={item.thumbnail} alt={item.title} className="w-24 h-24 object-cover rounded-lg" />
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                <p className="text-indigo-600 font-bold">₹{item.price.toFixed(2)} x {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h2>
            <div className="flex justify-between text-lg mb-2">
              <span>Subtotal</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg mb-2">
              <span>Shipping</span>
              <span>₹40.00</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total</span>
              <span>₹{(totalAmount + 40).toFixed(2)}</span>
            </div>
            <button
              className="w-full mt-5 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
              onClick={handlePlaceOrder}
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
