const express = require("express");
const router = express.Router();
const userController = require('../../controllers/userController');
const { generalLimiter, loginLimiter } = require("../../middleware/rateLimiters");

/**
 * @swagger
 * /api/v1/public/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Public]
 *     description: Registers a new user (admin, doctor, or general user) by generating and sending an OTP to their email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: user@example.com
 *               role:
 *                 type: string
 *                 description: The role of the user (admin, doctor, or general user).
 *                 example: doctor
 *     responses:
 *       201:
 *         description: OTP sent successfully. Check your email.
 *       400:
 *         description: Email already exists or invalid request data.
 */
router.post('/register', generalLimiter, userController.register);

/**
 * @swagger
 * /api/v1/public/login:
 *   post:
 *     summary: Login a user
 *     tags: [Public]
 *     description: Authenticates a user (doctor, admin, or regular user) and returns a JWT token with their role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: securePassword123
 *     responses:
 *       200:
 *         description: Login successful. Returns a JWT token and the user's role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 role:
 *                   type: string
 *                   description: The role of the user (doctor, admin, or user).
 *                   example: doctor
 *       401:
 *         description: Invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *       500:
 *         description: Server error.
 */
router.post('/login', loginLimiter, userController.login);

/**
 * @swagger
 * /api/v1/public/verify-otp:
 *   post:
 *     summary: Verify OTP and register a user
 *     tags: [Public]
 *     description: Verifies the OTP for a user and registers them in the system based on their role (doctor, admin, or general user).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 description: The OTP code sent to the user's email.
 *                 example: 123456
 *               fullName:
 *                 type: string
 *                 description: The full name of the user.
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 description: The user's desired password.
 *                 example: securePassword123
 *               role:
 *                 type: string
 *                 description: The role of the user (doctor, admin, or user).
 *                 example: user
 *     responses:
 *       200:
 *         description: OTP verified successfully, and the user is registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP verified successfully!
 *       400:
 *         description: Invalid OTP or OTP has expired.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid OTP
 *       500:
 *         description: Server error.
 */
router.post('/verify-otp', userController.verifyOtp);


module.exports = router;
