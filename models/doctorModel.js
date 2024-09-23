const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, unique: true, match: /.+\@.+\..+/  },
    fullName: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String }, // Field to store OTP
    otpExpires: { type: Date },
    role: { type: String, enum: ['user', 'doctor','admin'], default: 'user' } ,// Added role field
    isVerified: { type: Boolean, default: false },
    gender: { type: String, enum: ['Male', 'Female', 'Other']},
    phoneNumber: { type: String,  match: /^[0-9]{10}$/ },
    experience: { type: Number, min: 0 },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    specializations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Specialization' }],
    certifications: [
        {
            title: { type: String, required: true },
            issuedBy: { type: String, required: true },
            dateIssued: { type: Date, required: true },
            validUntil: { type: Date }
        }
    ],
    availabilityId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Availability' }]
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);


// , required: true
// required: true,
// , required: true 