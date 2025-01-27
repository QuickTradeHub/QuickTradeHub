const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { emailConfig } = require('./config');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Nodemailer Setup (for email notifications)
const transporter = nodemailer.createTransport(emailConfig);

// Endpoint: Send Email Notification
app.post('/notifications/send', (req, res) => {
  const { recipient, subject, message } = req.body;

  const mailOptions = {
    from: emailConfig.auth.user,
    to: recipient,
    subject: subject || 'Notification',
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    return res.status(200).send('Email sent: ' + info.response);
  });
});

// Endpoint: Send Order Confirmation Email
app.post('/notifications/order-confirmation', (req, res) => {
  const { recipient, orderId } = req.body;
  const message = `Your order ${orderId} has been successfully placed.`;

  sendNotification(recipient, 'Order Confirmation', message, res);
});

// Endpoint: Send Shipment Status Update Email
app.post('/notifications/shipment-update', (req, res) => {
  const { recipient, orderId, status } = req.body;
  const message = `Your order ${orderId} has been shipped. Status: ${status}`;

  sendNotification(recipient, 'Shipment Update', message, res);
});

// Endpoint: Send Payment Receipt Email
app.post('/notifications/payment-receipt', (req, res) => {
  const { recipient, orderId, amount } = req.body;
  const message = `Payment for your order ${orderId} of amount $${amount} has been received successfully.`;

  sendNotification(recipient, 'Payment Receipt', message, res);
});

// Endpoint: Send Promotional Email
app.post('/notifications/promotions', (req, res) => {
  const { recipient, promotionDetails } = req.body;
  const message = `Special Promotion: ${promotionDetails}`;

  sendNotification(recipient, 'Special Promotion', message, res);
});

// Helper function to send emails
function sendNotification(recipient, subject, message, res) {
  const mailOptions = {
    from: emailConfig.auth.user,
    to: recipient,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    return res.status(200).send('Email sent: ' + info.response);
  });
}

app.listen(port, () => {
  console.log(`Notification service running on port ${port}`);
});
