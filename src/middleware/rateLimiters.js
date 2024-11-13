// utils/rateLimiters.js
const rateLimit = require("express-rate-limit");

// Login route limiter - stricter rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  message: "Too many login attempts, please try again later.",
});

// General limiter for other unauthenticated routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs for unauthenticated users
  message: "Too many requests from this IP, please try again later.",
});

// Higher rate limit for authenticated users
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs for authenticated users
  message: "Too many requests, please try again later.",
});

// Dynamic rate limiter based on authentication status
const dynamicLimiter = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    // Apply higher rate limit for authenticated users
    return authLimiter(req, res, next);
  } else {
    // Apply default rate limit for unauthenticated users
    return generalLimiter(req, res, next);
  }
};

// Export the rate limiters
module.exports = {
  loginLimiter,
  generalLimiter,
  authLimiter,
  dynamicLimiter,
};
