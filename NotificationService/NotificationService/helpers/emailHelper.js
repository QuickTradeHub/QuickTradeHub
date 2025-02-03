// helpers/mailHelper.js
const nodemailer = require('nodemailer');
const { emailConfig } = require('../config/emailConfig');

// Nodemailer Setup (for email notifications)
const transporter = nodemailer.createTransport(emailConfig);

// Helper function to create beautiful HTML emails
function createHtmlEmail(content, subject) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f8f8f8;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            padding: 20px;
          }
          .email-header {
            text-align: center;
            background-color: #4CAF50;
            color: white;
            padding: 15px;
            border-radius: 8px 8px 0 0;
          }
          .email-header h1 {
            margin: 0;
            font-size: 24px;
          }
          .email-body {
            padding: 20px;
            color: #333;
            line-height: 1.6;
          }
          .email-footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #ddd;
            margin-top: 20px;
          }
          .btn {
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin-top: 10px;
          }
          @media screen and (max-width: 600px) {
            .email-container {
              padding: 10px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>${subject}</h1>
          </div>
          <div class="email-body">
            ${content}
          </div>
          <div class="email-footer">
            <p>QuickTradeHub - All rights reserved</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Helper function to send emails
function sendNotification(recipient, subject, message, res) {
  const mailOptions = {
    from: emailConfig.auth.user,
    to: recipient,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    return res.status(200).send('Email sent: ' + info.response);
  });
}

module.exports = { createHtmlEmail, sendNotification };
