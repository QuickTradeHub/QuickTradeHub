const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import CORS
const notificationRoutes = require('./routes/notificationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { Eureka } = require('eureka-js-client');
require('dotenv').config(); // Load environment variables from a .env file

const app = express();
const port = process.env.PORT || 3000;
const SERVICE_IP = process.env.SERVICE_IP || 'localhost'; // Fallback to localhost if not set
const EUREKA_SERVER_IP = process.env.EUREKA_SERVER_IP || 'localhost';

// Middleware
app.use(cors());  // Enable CORS for all origins
app.use(bodyParser.json());

// Routes
app.use('/notifications', notificationRoutes);
app.use('/payment', paymentRoutes);

const eurekaClient = new Eureka({
  instance: {
    app: 'notification-service',
    instanceId: `notification-service`,
    hostName: SERVICE_IP,
    ipAddr: SERVICE_IP,
    statusPageUrl: `http://${SERVICE_IP}:${port}`,
    healthCheckUrl: `http://${SERVICE_IP}:${port}/health`,
    port: {
      $: port,
      '@enabled': true
    },
    vipAddress: 'notification-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    host: EUREKA_SERVER_IP,
    port: 8761,
    servicePath: '/eureka/apps/'
  }
});

// Start the Eureka client
eurekaClient.start((error) => {
  if (error) {
    console.error('Error registering with Eureka:', error);
  } else {
    console.log('Successfully registered with Eureka');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Notification service running on port ${port}`);
});
