const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointmentDate: { type: Date, required: true },
  reason: { type: String, required: true, trim: true },
  startTime: { type: String, required: true, trim: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending' },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  prescription: {
      medications: [{ type: String }],
      dosage: { type: String },
      duration: { type: String }
  },
  notes: { type: String, maxlength: 500 }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

