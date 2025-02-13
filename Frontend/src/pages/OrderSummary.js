import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderSummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const products = location.state?.products || [];
  const totalAmount = products.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      toast.error('You need to log in first.');
      navigate('/login');
    } else {
      setUser(storedUser);
      fetchAddresses(storedUser.userId);
    }
  }, [navigate]);

  const fetchAddresses = async (userId) => {
    try {
      const response = await fetch(`https://quicktradehub.in/authenticationservice/auth/user/${userId}/address`);
      const data = await response.json();
      setAddresses(data);
      const primaryAddress = data.find(address => address.isPrimary);
      setSelectedAddress(primaryAddress || data[0]);
    } catch (error) {
      toast.error('Failed to fetch addresses.');
      console.error('Error fetching addresses:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.warn('Please select or add a shipping address.');
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
      const response = await fetch('https://quicktradehub.in/notificationservice/payment/order', {
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
            toast.success('Payment successful!');
            await confirmOrder(1);  // Set paymentStatus as 1 on successful payment
          },
          prefill: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            contact: user.phone,
          },
          theme: {
            color: '#4F46E5',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Error: Could not create Razorpay order.');
      }
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const confirmOrder = async (paymentStatus) => {
    const orderDetails = {
      userId: user.userId,
      shippingAddress: selectedAddress,
      billingAddress: selectedAddress,
      paymentStatus: paymentStatus,  // Adding paymentStatus to the order
      orderItems: products.map(product => ({
        sellerId: product.sellerId,
        productId: product._id,
        productName: product.title,
        quantity: product.quantity,
        unitPrice: product.price,
      })),
    };

    try {
      const response = await fetch('https://quicktradehub.in/orderservice/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
        toast.success('Order placed successfully!');
        navigate('/orders');
      } else {
        toast.error('Failed to place the order.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Something went wrong while placing the order.');
    }
  };

  const handleAddAddress = () => {
    navigate('/add-address', { state: { userId: user.userId } });
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-900">Order Summary</h1>

      {user && (
        <div className="max-w-2xl mx-auto mb-6 p-6 bg-white rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Details</h2>
          <p className="mb-2 text-gray-700"><strong>Name:</strong> {`${user.firstName} ${user.lastName}`}</p>
          <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
        </div>
      )}

      <div className="max-w-2xl mx-auto mb-6 p-6 bg-white rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Shipping Address</h2>
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address.addressId}
              className={`p-4 mb-3 border-2 rounded-2xl cursor-pointer transition-transform transform hover:scale-105 ${selectedAddress?.addressId === address.addressId ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl shadow-lg mt-4"
          onClick={handleAddAddress}
        >
          Add Address
        </button>
      </div>

      <div className="lg:grid lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          {products.map((item) => (
            <div key={item._id} className="flex items-center p-4 bg-white rounded-3xl shadow-2xl mb-4">
              <img src={item.thumbnail} alt={item.title} className="w-28 h-28 object-cover rounded-xl" />
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="text-indigo-600 font-bold">₹{item.price} x {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="p-6 bg-white rounded-3xl shadow-2xl">
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl shadow-lg mt-6 text-lg"
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
