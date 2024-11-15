const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');
const {validatePagination} = require('../../validators/adminValidator');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * /api/v1/admin:
 *   get:
 *     summary: Retrieve a list of admins
 *     description: This endpoint returns a list of users with the "admin" role, excluding sensitive information like profile images and encrypted passwords.
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []  # Requires Bearer token for this endpoint
 *     responses:
 *       200:
 *         description: A list of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier of the admin user
 *                   name:
 *                     type: string
 *                     description: Name of the admin user
 *                   email:
 *                     type: string
 *                     description: Email address of the admin user
 *                   role:
 *                     type: string
 *                     description: The role of the user (should be 'admin' for all returned users)
 *       401:
 *         description: Unauthorized. No token or invalid token provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized. Please provide a valid Bearer token.'
 *       403:
 *         description: Forbidden. The user does not have the necessary admin rights.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden. You do not have admin rights.'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal server error. Please try again later.'
 */
router.get('/', adminController.getAllAdmins);

router.get('/admin1' , adminController.admin);
router.get('/users', validatePagination, adminController.getAllUsers);
router.post('/image', adminController.uploadImage);

// In your routes file (e.g., userRoutes.js)
router.patch('/update/:adminId', adminController.updateAdmin);
router.delete('/user/:id' , adminController.deleteUser);

router.post('/logout', adminController.logout);
router.post('/image', adminController.uploadImage);

/**
 * @swagger
 * /api/v1/admin:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', adminController.createAdmin);

module.exports = router;
