const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const { verifyToken } = require('../../middleware/authMiddleware');


router.get('/users', userController.getAllUsers);



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
router.get('/user',verifyToken , userController.user);

router.post('/user' , userController.addUser);

router.delete('/user/:id' , userController.deleteUser);

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
router.post('/logout', userController.logout);

router.post('/image', userController.uploadImage);

router.patch('/update/:userId', userController.updateUser);


module.exports = router;
