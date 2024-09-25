const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/mongo');
const { swaggerOptions } = require('./config/swagger'); // Swagger options
const routesV1 = require('./routes/v1'); // Modularized routes
// Load environment variables
dotenv.config();

// Initialize app
const app = express();

const {
  PORT, MONGO_URI_LOCAL, EMAIL, PORT_FRONTEND         
} = process.env;
// Check required environment variables
const requiredEnvVars = ['PORT', 'MONGO_URI_LOCAL','EMAIL', 'PORT_FRONTEND']; // Add other required variables
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: `http://localhost:${PORT_FRONTEND}` 
}));

// Rate limiter configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

// Apply rate limiter to all API routes
app.use('/api/', apiLimiter);

// Connect to MongoDB
connectDB();

// Swagger docs setup
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use routes
app.use('/api/v1', routesV1);

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
  });
});
