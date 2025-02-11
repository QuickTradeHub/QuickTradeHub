import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const products = location.state?.products || [];
  const totalAmount = products.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [user, setUser] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      alert('You need to log in first.');
      navigate('/login');
    } else {
      setUser(storedUser);
      const primaryAddress = storedUser.addresses?.find(address => address.isPrimary);
      setSelectedAddress(primaryAddress || storedUser.addresses?.[0]);
    }
  }, [navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select or add a shipping address.');
      return;
    }

    const orderData = {
      amount: totalAmount + 40,
      currency: 'INR',
      receipt: `order_receipt_${Date.now()}`,
      userDetails: user,
      products: products,
    };

    try {
      const response = await fetch('http://localhost:3000/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data && data.orderId) {
        const options = {
          key: data.razorpayKey,
          amount: data.amount,
          currency: data.currency,
          order_id: data.orderId,
          name: 'QuickTradeHub',
          description: 'Order Payment',
          image: 'https://example.com/logo.png',
          handler: async function (response) {
            alert('Payment successful!');
            await confirmOrder();
          },
          prefill: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            contact: user.phone,
          },
          theme: {
            color: '#F37254',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert('Error: Could not create Razorpay order.');
      }
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const confirmOrder = async () => {
    const orderDetails = {
      userId: user.userId,
      shippingAddress: selectedAddress,
      billingAddress: selectedAddress,
      orderItems: products.map(product => ({
        productId: product._id,
        productName: product.title,
        quantity: product.quantity,
        unitPrice: product.price,
        sellerId: product.sellerId,
      })),
    };

    try {
      const response = await fetch('http://13.49.132.61:5142/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        alert('Order placed successfully!');
        navigate('/orders');
      } else {
        alert('Failed to place the order.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Something went wrong while placing the order.');
    }
  };

  const handleAddAddress = () => {
    navigate('/add-address', { state: { userId: user.userId } });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">Order Summary</h1>

      {user && (
        <div className="max-w-2xl mx-auto mb-6 p-6 bg-white rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Details</h2>
          <p className="mb-2 text-gray-700"><strong>Name:</strong> {`${user.firstName} ${user.lastName}`}</p>
          <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      <div className="max-w-2xl mx-auto mb-6 p-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Shipping Address</h2>
        {user && user.addresses?.length > 0 ? (
          user.addresses.map((address) => (
            <div
              key={address.addressId}
              className={`p-4 mb-3 border-2 rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${selectedAddress?.addressId === address.addressId ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
              onClick={() => setSelectedAddress(address)}
            >
              <p className="text-gray-800 font-semibold">{address.street}</p>
              <p className="text-gray-600">{address.city}, {address.state} - {address.zipCode}</p>
              <p className="text-gray-600">{address.country}</p>
              {address.isPrimary && <span className="text-sm text-green-500 font-semibold">Primary Address</span>}
            </div>
          ))
        ) : (
          <p className="text-gray-600 mb-4">No address found. Please add a shipping address.</p>
        )}

        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow-lg mt-4"
          onClick={handleAddAddress}
        >
          Add Address
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          {products.map((item) => (
            <div key={item._id} className="flex items-center p-4 bg-white rounded-2xl shadow-lg mb-4">
              <img src={item.thumbnail} alt={item.title} className="w-24 h-24 object-cover rounded-lg" />
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="text-indigo-600 font-bold">₹{item.price} x {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="p-6 bg-white rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="flex justify-between text-lg mb-2">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between text-lg mb-4">
              <span>Shipping</span>
              <span>₹40</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total</span>
              <span>₹{totalAmount + 40}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg shadow-lg mt-6 text-lg"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
