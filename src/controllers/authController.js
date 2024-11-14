const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();


// In your userController.js
exports.updateUser = async (req, res) => {
    try {
      // Destructure
      const { userId } = req.params; // Extract userId from URL parameters are the fields from req.body
      
    //   if (user.id !== userId && !user.isAdmin) {
    //     return res.status(403).json({ message: 'Forbidden' });
    //   }
      
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

        user.profileImage = image; 
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

// Logout user (invalidate token on client side)
exports.logout = (req, res) => { 
    res.json({ message: 'User logged out' });
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

