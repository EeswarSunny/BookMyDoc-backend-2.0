const bcryptjs = require('bcryptjs');
const Otp = require('../models/otpModel');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const Doctor = require('../models/doctorModel');

const verifyOtpAndCreateUser = async (email, otp, fullName, password, role) => {
    // Check if OTP is valid
    const otpEntry = await Otp.findOne({ email });
    if (!otpEntry || otpEntry.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    // Check if OTP has expired
    if (new Date() > otpEntry.expires) {
        throw new Error('OTP has expired');
    }

    // Create user based on the role
    const hashedPassword = await bcryptjs.hash(password, 10);
    let newUser;

    if (role === 'doctor') {
        newUser = new Doctor({ email, encPassword: hashedPassword, fullName, role });
    } else if (role === 'admin') {
        newUser = new Admin({ email, encPassword: hashedPassword, fullName, role });
    } else {
        newUser = new User({ email, encPassword: hashedPassword, fullName, role });
    }

    // Save the new user and delete the OTP entry
    await newUser.save();
    await Otp.deleteOne({ email });

    return newUser;
};

module.exports = {
    verifyOtpAndCreateUser,
};
