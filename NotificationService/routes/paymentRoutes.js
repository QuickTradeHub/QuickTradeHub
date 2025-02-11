const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
const dotenv = require('dotenv');

// Initialize dotenv for environment variables
dotenv.config();

// Initialize Razorpay instance with API credentials
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Get this from Razorpay Dashboard
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Get this from Razorpay Dashboard
});

// Route for creating an order in Razorpay
router.post('/order', async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body; // Receive amount and other details from the frontend

    // Order options for Razorpay
    const options = {
      amount: amount*100, // Amount in paise
      currency: currency || 'INR', // Default to INR if not provided
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
    };

    // Create an order using Razorpay API
    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error('Error creating Razorpay order:', err);
        return res.status(500).json({
          message: 'Error creating Razorpay order',
          error: err,
        });
      }

      // Send back the Razorpay order details to the frontend
      res.status(200).json({
        orderId: order.id,
        currency: order.currency,
        amount: order.amount,
      });
    });
  } catch (error) {
    console.error('Error creating order in Razorpay:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
