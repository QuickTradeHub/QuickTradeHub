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

const eurekaClient = new Eureka({
  instance: {
    app: 'notification-service',
    instanceId: `notification-service`,
    hostName: '13.60.97.119',  // Use your IP for the service's hostname
    ipAddr: '13.60.97.119',   // Use your IP for the service's IP address
    statusPageUrl: `http://13.60.97.119:3000`,  // Update with your service's port
    healthCheckUrl: `http://13.60.97.119:3000/health`,  // Update with your health check URL
    port: {
      $: 3000,  // Update with your actual port
      '@enabled': true
    },
    vipAddress: 'notification-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    host: '13.60.97.119',  // Eureka server's IP
    port: 8761,  // Eureka server's port
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
