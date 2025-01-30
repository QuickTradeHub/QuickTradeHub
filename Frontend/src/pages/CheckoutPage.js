import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const CheckoutPage = () => {
  const cart = useSelector((state) => state.cart.items);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = () => {
    // Handle payment logic
    alert('Payment Successful');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-4xl font-bold mb-6">Checkout</h1>
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between py-2">
                <p>{item.name} x {item.quantity}</p>
                <p>${item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Payment</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-2 p-2 border rounded-md"
          >
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
          </select>
          <button
            onClick={handlePayment}
            className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg"
          >
            Confirm Payment
          </button>
        </div>
      </div>
      <p className="text-2xl font-semibold">Total: ${total}</p>
    </div>
  );
};

export default CheckoutPage;
