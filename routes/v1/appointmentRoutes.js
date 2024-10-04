// routes/v1/appointmentRoutes.js

const express = require('express');
const router = express.Router();
const appointmentController = require('../../controllers/appointmentController');

/**
 * @swagger
 * /api/v1/appointments:
 *   get:
 *     summary: Retrieve a list of appointments
 *     tags: [Appointment]
 *     responses:
 *       200:
 *         description: A list of appointments
 *       500:
 *         description: Internal server error
 */
router.get('/', appointmentController.getAllAppointments);

router.get('/timeslots', appointmentController.timeslots);

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', appointmentController.createAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   put:
 *     summary: Edit an existing appointment
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the appointment to edit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *       404:
 *         description: Appointment not found
 *       400:
 *         description: Bad request
 */
router.put('/:id', appointmentController.editAppointment);

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   delete:
 *     summary: Cancel an appointment
 *     tags: [Appointment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the appointment to cancel
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Appointment canceled successfully
 *       404:
 *         description: Appointment not found
 */
router.delete('/:id', appointmentController.cancelAppointment);

module.exports = router;

