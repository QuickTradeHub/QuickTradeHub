import React, { useState } from 'react';
import axios from 'axios';

const PaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async () => {
    try {
      // Step 1: Send the amount to the backend to create an order
      const response = await axios.post('http://localhost:3000/payment/order', {
        amount: amount, // Amount in INR
      });

      // Step 2: Use Razorpay's Checkout.js to trigger the Razorpay page
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,  // Your Razorpay Key ID from .env
        amount: response.data.amount,  // Amount in paise
        currency: response.data.currency,
        order_id: response.data.id,
        name: 'QuickTradeHub',
        description: 'Product Payment',
        handler: function (payment) {
          alert('Payment Successful!');
          setPaymentSuccess(true);  // Set flag for successful payment
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '1234567890',
        },
        theme: {
          color: '#528FF0', // Your theme color
        },
      };

      // Step 3: Open Razorpay Checkout page
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      // Handle the payment success and failure events
      razorpay.on('payment.success', function (payment) {
        console.log('Payment successful:', payment);
        alert('Payment Successful!');
        setPaymentSuccess(true);
      });

      razorpay.on('payment.error', function (error) {
        console.log('Payment error:', error);
        alert('Payment Failed. Please try again.');
      });
    } catch (error) {
      console.error('Error initiating payment', error);
      alert('Payment initiation failed. Please try again.');
    }
  };

  return (
    <div className="payment-page">
      <h2>Confirm Your Order</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount (INR)"
      />
      <button onClick={handlePayment}>Confirm Order</button>
      {paymentSuccess && <p>Payment Successful!</p>}
    </div>
  );
};

export default PaymentPage;
