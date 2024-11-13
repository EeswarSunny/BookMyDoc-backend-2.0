const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Admin = require('../models/adminModel');
const Otp = require('../models/otpModel');
const { sendEmail } = require('../utils/emailUtils'); // Assuming you have a sendEmail function

// Generate OTP and send it to the user's email
const generateOtp = async (email, role) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Check if the email already exists for the provided role
    let existingUser;
    if (role === 'doctor') {
        existingUser = await Doctor.findOne({ email });
    } else if (role === 'admin') {
        existingUser = await Admin.findOne({ email });
    } else {
        existingUser = await User.findOne({ email });
    }

    if (existingUser) {
        throw new Error('Email already exists. Please try logging in.');
    }

    // Send OTP to email
    await sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}. It is valid for 10 minutes.`);

    // Check if OTP entry already exists for the email
    const existingOtpEntry = await Otp.findOne({ email });
    if (existingOtpEntry) {
        // Update existing OTP
        existingOtpEntry.otp = otp;
        existingOtpEntry.expires = otpExpires;
        await existingOtpEntry.save();
    } else {
        // Create new OTP entry
        await Otp.create({ email, otp, expires: otpExpires });
    }

    return otp;
};

module.exports = {
    generateOtp,
};
