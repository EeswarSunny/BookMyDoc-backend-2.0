const dotenv = require('dotenv');
const { validateRegistration, validateLogin, validateOtpVerification } = require('../validators/userValidator');
const { generateOtp, verifyOtpAndCreateUser, loginUser } = require('../services/userService');
dotenv.config();

exports.register = async (req, res) => {
    const { email, role } = req.body;
console.log(role);
    // Validate input data using Joi
    const validationErrors = validateRegistration(req.body);
    console.log("fhgfe");
    if (validationErrors) {
        return res.status(400).json({ message: validationErrors.join(', ')+"egwegwe" });
    }

    console.log("14r");
    try {
        // Call the service to generate OTP and handle user registration logic
        await generateOtp(email, role);
        res.status(201).send('Please check your email for the OTP.');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.verifyOtp = async (req, res) => {
    const { email, otp, fullName, password, role } = req.body;

    // Step 1: Validate and sanitize input
    const validationErrors = validateOtpVerification(req.body);
    if (validationErrors) {
        return res.status(400).json({ message: validationErrors.join(', ') });
    }

    try {
        // Step 2: Call the service to verify OTP and create a user
        const newUser = await verifyOtpAndCreateUser(email, otp, fullName, password, role);

        res.status(200).json({ message: 'OTP verified successfully! , login now'});
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Step 1: Validate the input
    const validationErrors = validateLogin(req.body);
    if (validationErrors) {
        return res.status(400).json({ message: validationErrors.join(', ') });
    }

    try {
        // Step 2: Call the service to login and get the JWT token
        const { token, role } = await loginUser(email, password);

        // Step 3: Send the response with token and role
        res.json({ token, role });
    } catch (err) {
        console.error('Login error:', err);
        res.status(401).json({ message: 'Invalid credentials' });
    }
};



