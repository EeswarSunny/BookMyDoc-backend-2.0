const Appointment = require('../models/appointmentModel');
const Availability = require('../models/availabilitySchema');

// Book a new appointment
exports.createAppointment = async (req, res) => {
    const { doctorId, userId, date, timeSlot, problem, symptoms , locationId } = req.body;
    // Validate the input
    if (!doctorId || !userId || !date || !timeSlot || !problem || !symptoms) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        // Create a new appointment
        const newAppointment = new Appointment({
            doctorId,
            patientId : userId , // Ensure you pass the user ID
            appointmentDate : date,
            timeSlot,
            reason : problem,
            symptoms,
            locationId,
            status: 'Confirmed', // Set the status to pending until the doctor confirms
        });

        // Save the appointment to the database
        const savedAppointment = await newAppointment.save();
        const availabilityDate = new Date(date); 

        const [startTime, endTime] = timeSlot.split(' -- ');
            console.log(startTime, endTime);
        const availability = await Availability.findOneAndUpdate(
            {
                doctorId,
                availabilityDate:{
                    $eq: availabilityDate.setUTCHours(0, 0, 0, 0) // Set to the start of the day in UTC
                },
                'shifts.timeSlots.startTime': startTime,
            },
            {
                $set: {
                    'shifts.$[].timeSlots.$[slot].status': 'Unavailable', // Update the status of the specific time slot
                }
            },
            {
                arrayFilters: [{ 'slot.startTime': startTime }], // Filter to find the correct time slot
                new: true, // Return the updated document
            }
        );

        console.log('Availability updated:', availability);
        
        // Return the saved appointment
        res.status(201).json(savedAppointment);
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all appointments for a user
exports.getAllAppointments = async (req, res) => {
    const { patientId } = req.params;
    try {
        const appointments = await Appointment.find({ patientId })
        .populate('doctorId', 'fullName gender experience rating') // Include fields you want from the Doctor model
        .populate('locationId', 'cityName hospitalName  pincode address'); // Include fields you want from the Location model
        console.log(appointments , "ghrt");
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch appointments' });
    }
};

exports.timeslots = async (req, res) => {
    console.log("hiisfwef");
    const { date, doctorId } = req.query;
    console.log(date , doctorId , "fgd");
    // Check if required parameters are present
    if (!date || !doctorId) {
        return res.status(400).json({ message: 'Date and doctor ID are required' });
    }

    try {
        // Convert date string to a Date object and log it
        const availabilityDate = new Date(date); 
console.log(availabilityDate);
        // Fetch availability based on doctor and date
        const availability = await Availability.findOne({
            doctorId: doctorId,
            availabilityDate:{
                $eq: availabilityDate.setUTCHours(0, 0, 0, 0) // Set to the start of the day in UTC
            },
        });


        if (!availability) {
            return res.status(404).json({ message: 'No availability found for this doctor on the specified date' });
        }

        // Extracting time slots from the found availability
        const timeSlots = availability.shifts.flatMap(shift => 
            shift.timeSlots.filter(slot => slot.status === 'Available') // Filter for available slots only
        );

        // Log the extracted time slots
console.log(timeSlots);
        res.status(200).json(timeSlots); // Return the available time slots
    } catch (error) {
        console.error('Error fetching time slots:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Edit an appointment
exports.editAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json(appointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: 'Canceled' }, { new: true });
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json(appointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
