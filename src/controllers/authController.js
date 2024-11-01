const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const sendEmail = require('../utils/emailService');
const Otp = require('../models/OtpModel')
const dotenv = require('dotenv');
dotenv.config();

exports.getAllUsers = async (req, res) => {
    try {
        const patients = await User.find(); // Populate if you have related data
        res.json(patients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
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
exports.addUser = async (req, res) => {
    const { fullName, email, password,gender, role, phone } = req.body;
    console.log(req.body);
    // Create a new doctor instance using the provided data
    const user = new User({
        fullName,
        email,
        gender,
        encPassword: await bcryptjs.hash(password, 10), 
        role: role || 'user', // Default to 'user' if not provided
        phone,
        
    });

    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error( err);
        res.status(400).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (err) {
        console.error(err); // Log the entire error for debugging
        res.status(500).json({ message: err.message });
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

        const token = jwt.sign({ id: user._id, role: user.isAdmin ? 'admin' : 'user' }, process.env.YOUR_JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, role: user.isAdmin ? 'admin' : 'user' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.user = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID from the token
        const user1 = await User.findById(userId).select('-encPassword'); // Exclude password from response
        if (!user1) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return all user details
        res.json({
            id: user1._id, // Include the user ID
            email: user1.email,
            fullName: user1.fullName,
            gender: user1.gender,
            dateOfBirth: user1.dateOfBirth,
            location : user1.location,
            phone :user1.phone,
            profileImage: user1.profileImage,

            // Add more fields as necessary
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


// In your userController.js
exports.updateUser = async (req, res) => {
    try {
      // Destructure
      const { userId } = req.params; // Extract userId from URL parameters are the fields from req.body
      const { fullName, phone, gender,  location, dateOfBirth } = req.body;
      // Build the updatedDetails object using only the fields provided in the request
      const updatedDetails = {};
      if (fullName) updatedDetails.fullName = fullName;
      if (phone) updatedDetails.phone = phone;  
      if (gender) updatedDetails.gender = gender;
      if (location) updatedDetails.location = location;
      if (dateOfBirth) updatedDetails.dateOfBirth = dateOfBirth;
  
      // Use $set to update the specified fields in the MongoDB document
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updatedDetails },
        { new: true, runValidators: true }
      );
  
      // Send success response with the updated user document
      res.status(200).json({
        message: 'User details updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      // Handle any errors that occur during the update process
      res.status(500).json({
        message: 'Error updating user details',
        error: error.message,
      });
    }
  };
  