const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authController');
const { verifyToken } = require('../../middleware/authMiddleware');
const { loginLimiter, generalLimiter } = require('../../utils/rateLimiters');


router.get('/users', authController.getAllUsers);



// Get user details
/**
 * @swagger
 * /api/v1/auth/user:
 *   get:
 *     summary: Get user details
 *     tags: [Auth]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user's unique identifier
 *                 email:
 *                   type: string
 *                   description: The user's email address
 *                 name:
 *                   type: string
 *                   description: The user's name
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the user was created
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/user',verifyToken , authController.user);
router.post('/user' , authController.addUser);
router.delete('/user/:id' , authController.deleteUser);

/**
 * @swagger
 * /api/v1/auth/logout:
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


router.post('/image', authController.uploadImage);

// In your routes file (e.g., userRoutes.js)
router.patch('/update/:userId', authController.updateUser);


module.exports = router;
