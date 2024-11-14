const express = require('express');
const adminRoutes = require('./adminRoutes.js');
// const doctorRoutes = require('./doctorRoutes');
// const appointmentRoutes = require('./appointmentRoutes');
// const authRoutes = require('./authRoutes');
// const uploadRoutes = require('./uploadRoutes');
const { dynamicLimiter } = require('../../middleware/rateLimiters.js');
const publicRoutes = require("./publicRoutes.js");
// const { isAuthenticated, isAdmin, verifyToken } = require('../../middleware/authMiddleware.js');
const router = express.Router();


router.use('/public', publicRoutes);

// router.use('/auth', verifyToken, isAuthenticated , authRoutes);
router.use('/admin', dynamicLimiter,  adminRoutes);
// router.use('/doctors', verifyToken, isAuthenticated, allowAdminOrDoctor, dynamicLimiter, doctorRoutes);
// router.use('/appointments', verifyToken, isAuthenticated, dynamicLimiter,  appointmentRoutes);

// router.use('/uploads', verifyToken, dynamicLimiter,  uploadRoutes);

module.exports = router;
