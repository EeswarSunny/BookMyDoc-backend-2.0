// routes/v1/doctorRoutes.js
const express = require('express');
const router = express.Router();
const doctorController = require('../../controllers/doctorController');

/**
 * @swagger
 * /api/v1/doctors:
 *   get:
 *     summary: Retrieve a list of doctors
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: A list of doctors
 *       500:
 *         description: Internal server error
 */
router.get('/', doctorController.getAllDoctors);

/**
 * @swagger
 * /api/v1/doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               specialization:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', doctorController.createDoctor);

/**
 * @swagger
 * /api/v1/doctors/location/{locationId}:
 *   get:
 *     summary: Retrieve doctors by location
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: locationId
 *         required: true
 *         description: ID of the location to filter doctors
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of doctors for the specified location
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   specialization:
 *                     type: string
 *                   email:
 *                     type: string
 *       404:
 *         description: No doctors found for the specified location
 *       500:
 *         description: Internal server error
 */
router.get('/location/:locationId', doctorController.getDoctorsByLocation);

module.exports = router;
