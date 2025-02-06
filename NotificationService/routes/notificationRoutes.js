const express = require('express');
const router = express.Router();
const { createHtmlEmail, sendNotification } = require('../helpers/emailHelper');
require('dotenv').config(); // Load environment variables from a .env file

// Endpoint: Send Email Notification
router.post('/send', (req, res) => {
  const { recipient, subject, message } = req.body;
  const htmlContent = createHtmlEmail(message, subject);
  sendNotification(recipient, subject, htmlContent, res);
});

// Endpoint: Send Order Confirmation Email
router.post('/order-confirmation', (req, res) => {
  const { recipient, orderId } = req.body;
  const message = `Dear customer, <br><br> Your order <strong>${orderId}</strong> has been successfully placed. Thank you for shopping with us!<br><br><a href="http://${process.env.WEB_PUBLIC_IP}/orders/${orderId}" class="btn">View Order</a>`;
  const htmlContent = createHtmlEmail(message, 'Order Confirmation');
  sendNotification(recipient, 'Order Confirmation', htmlContent, res);
});

// Endpoint: Send Shipment Status Update Email
router.post('/shipment-update', (req, res) => {
  const { recipient, orderId, status } = req.body;
  const message = `Dear customer, <br><br> Your order <strong>${orderId}</strong> has been shipped. Status: ${status}.<br><br>Track your shipment <a href="http://${process.env.WEB_PUBLIC_IP}/track/${orderId}" class="btn">Track Order</a>`;
  const htmlContent = createHtmlEmail(message, 'Shipment Status Update');
  sendNotification(recipient, 'Shipment Status Update', htmlContent, res);
});

// Endpoint: Send Payment Receipt Email
router.post('/payment-receipt', (req, res) => {
  const { recipient, orderId, amount } = req.body;
  const message = `Dear customer, <br><br> Payment of <strong>$${amount}</strong> for order <strong>${orderId}</strong> has been successfully received. Thank you for your payment.<br><br>For more details, visit your <a href="http://${process.env.WEB_PUBLIC_IP}/orders/${orderId}" class="btn">Order History</a>`;
  const htmlContent = createHtmlEmail(message, 'Payment Receipt');
  sendNotification(recipient, 'Payment Receipt', htmlContent, res);
});

// Endpoint: Send Promotional Email
router.post('/promotions', (req, res) => {
  const { recipient, promotionDetails } = req.body;
  const message = `Hello, <br><br> Enjoy our special promotion: <strong>${promotionDetails}</strong><br><br>Claim your offer now!<br><br><a href="http://${process.env.WEB_PUBLIC_IP}/promotions" class="btn">Grab Offer</a>`;
  const htmlContent = createHtmlEmail(message, 'Special Promotion');
  sendNotification(recipient, 'Special Promotion', htmlContent, res);
});

// Endpoint: Send Account Registration Email
router.post('/account-registration', (req, res) => {
  const { recipient, messageBody } = req.body;
  const message = `Welcome to QuickTradeHub, <br><br> Your account has been successfully created. Username: <strong>${messageBody}</strong>.<br><br><a href="http://${process.env.WEB_PUBLIC_IP}/login" class="btn">Login to your account</a>`;
  const htmlContent = createHtmlEmail(message, 'Account Registration');
  sendNotification(recipient, 'Account Registration', htmlContent, res);
});

// Endpoint: Send Password Reset Email
router.post('/password-reset', (req, res) => {
  const { recipient, messageBody } = req.body;
  const message = `Dear user, <br><br> We received a request to reset your password. If you requested a password reset, click the link below: <br><br><a href="${messageBody}" class="btn">Reset Password</a><br><br>If you did not request a password reset, please ignore this email.`;
  const htmlContent = createHtmlEmail(message, 'Password Reset');
  sendNotification(recipient, 'Password Reset', htmlContent, res);
});

// Endpoint: Send Welcome Email for New User Activity
router.post('/user-activity', (req, res) => {
  const { recipient, messageBody } = req.body;
  const message = `Hello, <br><br> You've recently performed the following activity: <strong>${messageBody}</strong><br><br><a href="http://${process.env.WEB_PUBLIC_IP}/activity" class="btn">View Your Activity</a>`;
  const htmlContent = createHtmlEmail(message, 'User Activity');
  sendNotification(recipient, 'User Activity', htmlContent, res);
});

// Endpoint: Send Support Ticket Confirmation Email
router.post('/support-ticket', (req, res) => {
  const { recipient, ticketId, issueDescription } = req.body;
  const message = `Dear customer, <br><br> Your support ticket <strong>${ticketId}</strong> has been created. Issue: ${issueDescription}.<br><br>Our support team will get back to you soon. <a href="http://${process.env.WEB_PUBLIC_IP}/support/${ticketId}" class="btn">View Ticket</a>`;
  const htmlContent = createHtmlEmail(message, 'Support Ticket Confirmation');
  sendNotification(recipient, 'Support Ticket Confirmation', htmlContent, res);
});

// Endpoint: Send Newsletter Email
router.post('/newsletter', (req, res) => {
  const { recipient, newsletterContent } = req.body;
  const message = `Hello, <br><br> Here's the latest newsletter from QuickTradeHub: <br><br>${newsletterContent}<br><br><a href="http://${process.env.WEB_PUBLIC_IP}/newsletter" class="btn">Read More</a>`;
  const htmlContent = createHtmlEmail(message, 'QuickTradeHub Newsletter');
  sendNotification(recipient, 'QuickTradeHub Newsletter', htmlContent, res);
});

// Endpoint: Send Email for Special Offers
router.post('/special-offer', (req, res) => {
  const { recipient, offerDetails } = req.body;
  const message = `Hello, <br><br> We have an exclusive offer just for you: <strong>${offerDetails}</strong><br><br>Don't miss out! <a href="http://${process.env.WEB_PUBLIC_IP}/special-offers" class="btn">Claim Offer</a>`;
  const htmlContent = createHtmlEmail(message, 'Special Offer');
  sendNotification(recipient, 'Special Offer', htmlContent, res);
});

module.exports = router;
