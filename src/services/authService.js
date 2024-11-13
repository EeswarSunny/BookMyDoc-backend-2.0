const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctorModel');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');

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
    const token = jwt.sign({ id: user._id, role }, process.env.YOUR_JWT_SECRET, { expiresIn: '24h' });
    return { token, role };  // Token generated immediately after successful match
};

module.exports = { loginUser };
