const express = require('express');
const bodyParser = require('body-parser');
const notificationRoutes = require('./routes/notificationRoutes');
const { Eureka } = require('eureka-js-client');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/notifications', notificationRoutes);

// Eureka client configuration
const eurekaClient = new Eureka({
  instance: {
    app: 'notification-service',
    instanceId: `notification-service:${port}`,
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: `http://localhost:${port}`,
    healthCheckUrl: `http://localhost:${port}/health`,
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
    host: '13.60.97.119',
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
