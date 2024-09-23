const express = require('express');
const adminRoutes = require('./adminRoutes');
const doctorRoutes = require('./doctorRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const authRoutes = require('./authRoutes');

const router = express.Router();
// Define routes
router.use('/admin', adminRoutes);
router.use('/auth', authRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);

module.exports = router;
