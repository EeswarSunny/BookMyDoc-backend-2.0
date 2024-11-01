const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    startTime: { type: String, required: true }, // e.g., "10:00 AM"
    endTime: { type: String, required: true },   // e.g., "10:30 AM"
    status: { type: String, enum: ['Available', 'Unavailable'], required: true }
});

const shiftSchema = new mongoose.Schema({
    shift: { type: String, enum: ['Morning', 'Afternoon', 'Night'], required: true },
    timeSlots: [timeSlotSchema] // Array of half-hour slots for the shift
});

const availabilitySchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    availabilityDate: { type: Date, required: true },
    shifts: [shiftSchema] // Array of shifts for the day
}, { timestamps: true });

module.exports = mongoose.model('Availability', availabilitySchema);