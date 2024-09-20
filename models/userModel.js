const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, unique: true },
    fullName: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String }, // Field to store OTP
    otpExpires: { type: Date },
    role: { type: String, enum: ['user', 'doctor','admin'], default: 'user' } ,// Added role field
    isVerified: { type: Boolean, default: false },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
