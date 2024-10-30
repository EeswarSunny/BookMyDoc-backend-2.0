const Doctor = require('../models/doctorModel');
const Location = require('../models/locationModel');
const bcryptjs = require('bcryptjs');

exports.doctor = async (req, res) => {
    try {
        const doctorId = req.doctor.id; // Get the user ID from the token
        const doctor1 = await Doctor.findById(doctorId).select('-encPassword'); // Exclude password from response
        if (!doctor1) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        // Return all user details
        res.json({
            id: doctor1._id,
            email: doctor1.email,
            fullName: doctor1.fullName,
            gender: doctor1.gender,
            dateOfBirth: doctor1.dateOfBirth,
            location : doctor1.location,
            phone :doctor1.phone,
            profileImage: doctor1.profileImage,
 
        });
        
    } catch (err) {
        console.error(err); // Log the entire error for debugging
        res.status(500).json({ message: err.message });
    }
};


// Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ rating: { $gte: 4.5 } })
        .populate('specializations')
        .populate('locationId')
        .sort({ rating: -1 })
        .limit(10);
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new doctor
exports.addDoctor = async (req, res) => {
    const { fullName, email, password,gender, role, isVerified, phoneNumber, experience , rating } = req.body;
    console.log(req.body);
    // Create a new doctor instance using the provided data
    const doctor = new Doctor({
        fullName,
        email,
        gender,
        encPassword: await bcryptjs.hash(password, 10), 
        role: role || 'doctor', // Default to 'doctor' if not provided
        isVerified: isVerified || false, // Default to false if not provided
        phoneNumber,
        experience,
        rating,
    });

    try {
        const savedDoctor = await doctor.save();
        res.status(201).json(savedDoctor);
    } catch (err) {
        console.error(err); // Log the entire error for debugging
        res.status(400).json({ message: err.message });
    }
};


// Delete a doctor
exports.deleteDoctor = async (req, res) => {
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(id);

        if (!deletedDoctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        res.status(200).json({ message: 'Doctor deleted successfully', deletedDoctor });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getDoctorsByLocation = async (req, res) => {
    const { locationId } = req.params;
    
    if (!locationId) {
        console.log(locationId);
        return res.status(400).json({ message: 'Location ID is required.' });
    }

    try {
        const doctors = await Doctor.find({ locationId: locationId }).populate('specializations');
        res.json(doctors);
    } catch (err) {
        console.error('Error fetching doctors:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all locations
exports.getAllLocations = async (req, res) => {
    try {
        // Fetch all locations and select only the 'name' field
        const locations = await Location.find().select('cityName'); // Assuming 'name' is the field for city names
        
        // Map to extract just the names into an array
        const cityNames = locations.map(location => location.name);
        
        // Send the array of city names as a JSON response
        res.json(locations);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching locations' });
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

exports.getDoctorDashboard = async (req, res) => {1
    const doctorId = req.doctor.id;
    try {
        const doctor = await Doctor.findById(doctorId)
            .populate('specializations')
            .populate('availabilityId');

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }
        res.json(doctor);
    } catch (err) {
        console.error('Error fetching doctor dashboard:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.uploadImage = async (req, res) => {
    const { userId, image } = req.body; // Assume image is sent as a Base64 string

    if (!image || !userId) {
        return res.status(400).json({ message: 'No image or user ID provided' });
    }

    try {
        const user = await Doctor.findById(userId);
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