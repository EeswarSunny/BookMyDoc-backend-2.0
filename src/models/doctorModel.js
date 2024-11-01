const mongoose = require('mongoose');
const Specialization = require('./specializationSchema'); 
const Certification = require('./certificationModel'); 
const Availability = require('./availabilitySchema'); 

const doctorSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, unique: true, match: /.+\@.+\..+/  },
    fullName: { type: String, required: true, trim: true, unique: true },
    profileImage: { type: String },
    encPassword: { type: String, required: true },
    role: { type: String, enum: ['user', 'doctor'], default: 'doctor' } ,// Added role field
    isVerified: { type: Boolean, default: false },
    gender: { type: String, enum: ['Male', 'Female', 'Other']},
    phoneNumber: { type: String,  match: /^[0-9]{10}$/ },
    experience: { type: Number, min: 0 },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    specializations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Specialization' }],
    certifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Certification' }],
    availabilityId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Availability' }]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);


