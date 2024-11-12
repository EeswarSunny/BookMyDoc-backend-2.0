const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const sendEmail = require('../utils/emailService');
const Otp = require('../models/OtpModel')
const dotenv = require('dotenv');
dotenv.config();

// Register a new user
exports.register = async (req, res) => {
    const { email , role } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    try {
        // Check if the email already exists in the User model
        let existingUser;
        if (role === 'doctor') {
            existingUser = await Doctor.findOne({ email });
        } else if (role === 'admin') {
            existingUser = await Admin.findOne({ email });
        } else {
            existingUser = await User.findOne({ email });
        }
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists. Please try logging in.' });
        }
        await sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}. It is valid for 10 minutes.`);
        // Check if the email already exists in the OTP model
        const existingOtpEntry = await Otp.findOne({ email });
        if (existingOtpEntry) {
            // If it exists, update the OTP and expiration time
            existingOtpEntry.otp = otp;
            existingOtpEntry.expires = otpExpires;
            await existingOtpEntry.save();
        } else {
            // If it doesn't exist, create a new entry
            await Otp.create({ email, otp, expires: otpExpires });
        }
        res.status(201).send('Please check your email for the OTP.');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.verifyOtp = async (req, res) => {
    const { email, otp , fullName ,password, role } = req.body;
    try {
        const otpEntry = await Otp.findOne({ email });
        if (!otpEntry || otpEntry.otp !== otp) {
           return res.status(400).json({ error: 'Invalid OTP' });
        }

        if (new Date() > otpEntry.expires) {
            return res.status(400).json('OTP has expired');
        }
        let newUser;
        if (role === 'doctor') {
            newUser = new Doctor({ email, encPassword: await bcryptjs.hash(password, 10), fullName, role });
        } else if (role === 'admin') {
            newUser = new Admin({ email, encPassword: await bcryptjs.hash(password, 10), fullName, role });
        } else {
            newUser = new User({ email, encPassword: await bcryptjs.hash(password, 10), fullName, role });
        }

        await newUser.save();
        await Otp.deleteOne({ email });

        res.status(200).json({ message: 'OTP verified successfully!' });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json('Server error');
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check for doctors first
        const doctor = await Doctor.findOne({ email });
        if (doctor && await bcryptjs.compare(password, doctor.encPassword)) {
            const token = jwt.sign({ id: doctor._id, role: 'doctor' }, process.env.YOUR_JWT_SECRET, { expiresIn: '24h' });
            return res.json({ token, role: 'doctor' });
        }

        // Check for admin
        const admin = await Admin.findOne({ email });
        if (admin && await bcryptjs.compare(password, admin.encPassword)) {
            const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.YOUR_JWT_SECRET, { expiresIn: '24h' });
            return res.json({ token, role: 'admin' });
        }

        // Check for regular users
        const user = await User.findOne({ email });
        if (!user || !(await bcryptjs.compare(password, user.encPassword))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role:'user' }, process.env.YOUR_JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, role: user.isAdmin ? 'admin' : 'user' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
