const express = require('express');
const bodyParser = require("body-parser");
const connectDB = require('./config/db');
const Eureka = require('eureka-js-client').Eureka;
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const cors = require('cors');

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// CORS Configuration - Allow all origins
const corsOptions = {
  origin: '*',  // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow credentials such as cookies or headers
};

app.use(cors(corsOptions));  // Use the CORS middleware with the options
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use Routes
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes);

// Eureka Client Configuration
const client = new Eureka({
  eureka: {
    host: '13.49.119.218', // Eureka server host
    port: 8761,        // Eureka server port
    servicePath: '/eureka/apps', // Eureka service API path
  },
  instance: {
    app: 'product-service', // The name of your application
    instanceId: 'product-service-instance-1', // Unique instance ID for your service
    hostName: 'localhost', // Hostname where your service is running
    ipAddr: '13.49.132.61', // IP address of the service
    port: {
      '$': 3000, // Port where your Express app is running
      '@enabled': 'true', // Enable this port
    },
    vipAddress: 'product-service', // Virtual address of your service
    secureVipAddress: 'product-service', // Optional secure virtual address
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      'name': 'MyOwn', // The name of your data center (can be 'MyOwn' for local)
    },
  },
});

// Start Eureka client to register the service
client.start(function() {
  console.log('Product service registered with Eureka');
});

// Graceful shutdown to deregister from Eureka
process.on('SIGINT', async () => {
  console.log('Shutting down, deregistering from Eureka');
  client.stop();
  console.log('MongoDB disconnected on app termination');
  process.exit(0);
});

// Start Express server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
