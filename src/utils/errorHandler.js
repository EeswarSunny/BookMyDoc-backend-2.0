const logger = require('./logger'); // Assuming you have a logger utility
require('dotenv').config();

module.exports.handleError = async (err, res) => {

  logger.error(err.stack || err.message);

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // Include stack trace in development
  });
};
