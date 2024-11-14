const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = async (req, res, next) => {
    console.log(1);
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.YOUR_JWT_SECRET);
        req.user = decoded;
        if (!req.user.id) {
            return res.status(404).json({ message: 'User not found' });
        }
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const isAuthenticated = async (req, res, next) => {
    console.log(2);

    const token = req.headers["authorization"]?.split(" ")[1]; 
    console.log(2);

    if (!token) {
      req.isAuthenticated = () => false; 
      return next();
    }
    console.log(2);

    try {
      const decoded = jwt.verify(token, process.env.YOUR_JWT_SECRET);
      req.isAuthenticated = () => true;
      req.user = decoded; 
      next();
    } catch (err) {
      req.isAuthenticated = () => false; 
      next();
    }
};


// const authorizeAdmin = async (req, res, next) => {
//     console.log(4);

//     try {
//         const user = await Admin.findById(req.user.id);
//         if (user.role !== 'admin') {
//             return res.status(403).json({ message: 'Access denied' });
//         }
//         next();
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };


const isAdmin = async (req, res, next) => {
    console.log(3);

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You do not have admin rights' });
    }
    next();
};

const allowAdminOrDoctor = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
    }
    next();
  };
  

module.exports = {isAuthenticated, verifyToken, isAdmin, allowAdminOrDoctor };
