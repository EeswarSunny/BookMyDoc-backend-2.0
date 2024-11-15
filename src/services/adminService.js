// services/adminService.js
const Admin = require('../models/adminModel'); 
const User = require('../models/userModel'); 

const getAllAdmins = async () => {
    try {
        const admins = await Admin.find({ role: 'admin' }).select('-profileImage -encPassword');
        return admins; 
    } catch (error) {
        throw new Error('Error fetching admins: ' + error.message);
    }
};


const getAllUsers = async (page = 1, limit = 10) => {
    try {
        const pageNumber = Math.max(1, parseInt(page)); 
        const pageSize = Math.min(Math.max(1, parseInt(limit)), 100);
        const skip = (pageNumber - 1) * pageSize;

        const users = await User.find({ role: 'user' }).skip(skip).limit(pageSize);
        const totalUsers = await User.countDocuments({ role: 'user' });
        return {
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / pageSize), 
            currentPage: pageNumber,
            pageSize: pageSize,
        };
    } catch (error) {
        throw new Error('Error fetching users: ' + error.message);
    }
};


module.exports = {
    getAllAdmins, getAllUsers, 
};