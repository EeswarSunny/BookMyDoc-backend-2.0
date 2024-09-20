const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const sendEmail = require('../utils/emailService');

// Register a new user
exports.register = async (req, res) => {
    const { email, password , fullName , role } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    try {
        const user = new User({ email, password , fullName , role, otp, otpExpires, isVerified: false });
        await user.save();
        await sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}. It is valid for 10 minutes.`);
        res.status(201).send('User registered. Please check your email for the OTP.');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Register a new admin
exports.registerAdmin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = new User({ username, password, role: 'admin' });
        await admin.save();
        res.status(201).json({ message: 'Admin registered' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp) {
           return res.status(400).json({ error: 'Invalid OTP' });
        }

        if (new Date() > user.otpExpires) {
            return res.status(400).json('OTP has expired');
        }

        // Clear OTP fields after successful verification
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

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
        const user = await User.findOne({ email });
        if (!user || !(await bcryptjs.compare( password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Logout user (invalidate token on client side)
exports.logout = (req, res) => { 
    res.json({ message: 'User logged out' });
};
