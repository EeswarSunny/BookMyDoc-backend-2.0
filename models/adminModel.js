const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, unique: true },
    fullName: { type: String, required: true, trim: true, unique: true },
    encPassword: { type: String, required: true },
    phone: { type: String },
    gender: { type: String },
    dateOfBirth: { type: Date },
    location: { type: String },
    role: { type: String, enum: ['user', 'doctor','admin'], default: 'user' } ,// Added role field
    profileImage: { type: String },
});

module.exports = mongoose.model('Admin', adminSchema);
