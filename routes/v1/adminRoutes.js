const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/adminController');

/**
 * @swagger
 * /api/v1/admin:
 *   get:
 *     summary: Retrieve a list of admins
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: A list of admins
 *       500:
 *         description: Internal server error
 */
router.get('/', adminController.getAllAdmins);

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
