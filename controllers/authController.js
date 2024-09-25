const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const sendEmail = require('../utils/emailService');
const Otp = require('../models/OtpModel')
const dotenv = require('dotenv');
dotenv.config();


// Register a new user
exports.register = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
    try {
        // Check if the email already exists in the User model
        const existingUser = await User.findOne({ email });
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
        const user = new User({ email, encPassword: await bcryptjs.hash(password, 10), fullName, role });
        await user.save();
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
        const user = await User.findOne({ email });
        if (!user || !(await bcryptjs.compare( password, user.encPassword))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.YOUR_JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.user = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the token
        const user1 = await User.findById(userId).select('-encPassword'); // Exclude password from response
        if (!user1) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            id: req.user._id,
            email: req.user.email,
            fullName: req.user.fullName,
            
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Logout user (invalidate token on client side)
exports.logout = (req, res) => { 
    res.json({ message: 'User logged out' });
};


// @route   POST /api/v1/uploads
// @desc    Upload image and store it in MongoDB
// @access  Public (or Private if necessary)
exports.uploadImage = async (req, res) => {
    const { userId, image } = req.body; // Assume image is sent as a Base64 string

    if (!image || !userId) {
        return res.status(400).json({ message: 'No image or user ID provided' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profileImage = image; // Store the Base64 string in the user's profileImage field
        await user.save();

        res.status(200).json({
            message: 'File uploaded and stored successfully!',
            user,
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Server error' });
    }
};