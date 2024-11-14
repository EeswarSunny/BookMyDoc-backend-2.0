const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Admin = require('../models/adminModel');
const Otp = require('../models/otpModel');
const sendEmail  = require('../utils/emailService');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate OTP and send it to the user's email
const generateOtp = async (email, role) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

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
    const subject= 'Your OTP Code';
    const text= `Your OTP code is ${otp}. It is valid for 10 minutes.`;
    // Send OTP to email
    await sendEmail(email, subject, text );

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

const loginUser = async (email, password) => {
    // Check for doctors first
    const doctor = await Doctor.findOne({ email });
    if (doctor && await bcryptjs.compare(password, doctor.encPassword)) {
        const token = jwt.sign({ id: doctor._id, role: 'doctor' }, process.env.YOUR_JWT_SECRET, { expiresIn: '24h' });
        return { token, role: 'doctor' };  // Token generated immediately after successful match
    }

    // Check for admin
    const admin = await Admin.findOne({ email });
    if (admin && await bcryptjs.compare(password, admin.encPassword)) {
        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.YOUR_JWT_SECRET, { expiresIn: '24h' });
        return { token, role: 'admin' };  // Token generated immediately after successful match
    }

    // Check for regular users
    const user = await User.findOne({ email });
    if (!user || !(await bcryptjs.compare(password, user.encPassword))) {
        throw new Error('Invalid credentials');  // If no user found or password mismatch
    }

    const role = user.isAdmin ? 'admin' : 'user';
    const token = jwt.sign({ id: user._id, role: 'admin' }, process.env.YOUR_JWT_SECRET, { expiresIn: '24h' });
    return { token, role };  // Token generated immediately after successful match
};


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
    generateOtp, loginUser, verifyOtpAndCreateUser
};
