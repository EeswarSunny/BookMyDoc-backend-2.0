const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    issuedBy: { type: String, required: true },
    dateIssued: { type: Date, required: true },
    validUntil: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
