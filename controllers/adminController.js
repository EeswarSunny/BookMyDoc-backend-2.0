const Admin = require('../models/userModel'); // Adjust the path to your Admin model

/**
 * Get all admins
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({ role: 'admin' }); // Retrieve all admins from the database
        return res.status(200).json(admins); // Send back the list of admins
    } catch (error) {
        console.error('Error retrieving admins:', error);
        return res.status(500).json({ message: 'Internal server error' }); // Handle any errors
    }
};

/**
 * Create a new admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
exports.createAdmin = async (req, res) => {
    const { email, password , fullName , role } = req.body;

    try {
        // Validate input (this can be expanded as needed)
        if (!fullName || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
        const admin = new Admin({ email, password , fullName , role, otp, otpExpires, isVerified: false });
        await admin.save();
        await sendEmail(email, 'Your OTP Code', `Your OTP code is ${otp}. It is valid for 10 minutes.`);
        res.status(201).json('Admin registered. Please check your email for the OTP.');
    } catch (error) {
        console.error('Error creating admin:', error);
        return res.status(500).json({ message: 'Internal server error' }); // Handle any errors
    }
};
