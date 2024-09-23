const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
// Register a new user
/**
 * @swagger
 * /api/v2/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', authController.register);



// Login user
/**
 * @swagger
 * /api/v2/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/v2/auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     description: Logs out the current user and invalidates their session.
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized, user is not logged in
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/v2/auth/verify-otp:
 *   post:
 *     summary: Verify OTP for a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid OTP
 */
router.post('/verify-otp', authController.verifyOtp);


module.exports = router;
