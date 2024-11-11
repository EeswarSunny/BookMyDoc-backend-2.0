const express = require('express');
const adminRoutes = require('./adminRoutes');
const doctorRoutes = require('./doctorRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const authRoutes = require('./authRoutes');
const uploadRoutes = require('./uploadRoutes');
const { dynamicLimiter } = require('../../utils/rateLimiters');
const router = express.Router();
const publicRoutes = require("./publicRoutes.js");

// Define routes
router.use('/admin', dynamicLimiter , adminRoutes);
router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/doctors',dynamicLimiter, doctorRoutes);
router.use('/appointments',dynamicLimiter , appointmentRoutes);
router.use('/uploads',dynamicLimiter,  uploadRoutes);

module.exports = router;
