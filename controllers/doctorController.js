const Doctor = require('../models/doctorModel');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('locationId');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get doctors by location
exports.getDoctorsByLocation = async (req, res) => {
    try {
        const doctors = await Doctor.find({ locationId: req.params.locationId });
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Create a new doctor
exports.createDoctor = async (req, res) => {
    const { fullName, password, email } = req.body;

    // Basic input validation
    if (!fullName || !password || !email) {
        return res.status(400).json({ message: 'Name, specialization, and email are required' });
    }

    try {
        // Create a new doctor instance
        const newDoctor = new Doctor({
            fullName,
            password,
            email
        });

        // Save the doctor to the database
        await newDoctor.save();
        
        // Respond with the created doctor information
        res.status(201).json({
            message: 'Doctor created successfully',
            doctor: newDoctor
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
