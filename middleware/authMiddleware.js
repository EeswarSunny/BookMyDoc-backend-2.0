const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const util = require('util')
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    authenticateToken: (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).json({ message: 'No token provided' });
        jwt.verify(token, process.env.YOUR_JWT_SECRET, (err, decoded) => {
            if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
            req.userId = decoded.id;
            console.log("decode ", decoded);
            next();
        });
    },

    authorizeAdmin: async (req, res, next) => {
        try {
            const user = await User.findById(req.userId);
            if (user.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied' });
            }
            next();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    verifyToken : async (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
        if (!token) {
            return res.status(401).json({ message: 'No token provided'});
        }
        try {
            const decoded = jwt.verify(token, process.env.YOUR_JWT_SECRET); // Replace with your actual secret
            console.log(decoded);
            req.user = await User.findById(decoded.id); // Attach user info to request
            if (!req.user) {
                return res.status(404).json({ message: 'User not found' });
            }
            next(); // Proceed to the next middleware or route handler
        } catch (err) {
            return res.status(401).json( err.message);
        }
    },
};
