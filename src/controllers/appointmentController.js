const Appointment = require('../models/appointmentModel');
const Availability = require('../models/availabilitySchema');
const logger = require('../utils/logger');
// Book a new appointment
exports.createAppointment = async (req, res) => {
    const { doctorId, userId, date, slotId, slotTime, problem, symptoms , locationId } = req.body;
    // Validate the input
    if (!doctorId || !userId || !date || !slotId || !slotTime || !problem || !symptoms) {
        logger.info('All fields are required');
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        // Create a new appointment
        const newAppointment = new Appointment({
            doctorId,
            patientId : userId , // Ensure you pass the user ID
            appointmentDate : date,
            slotId,
            startTime :slotTime,
            reason : problem,
            symptoms,
            locationId,
            status: 'Confirmed', // Set the status to pending until the doctor confirms
        });

        // Save the appointment to the database
        const savedAppointment = await newAppointment.save();
        const availabilityDate = new Date(date); 

        const availability = await Availability.findOneAndUpdate(
            {
                doctorId,
                availabilityDate:{
                    $eq: availabilityDate.setUTCHours(0, 0, 0, 0) // Set to the start of the day in UTC
                },
                'shifts.timeSlots._id': slotId,
            },
            {
                $set: {
                    'shifts.$[].timeSlots.$[slot].status': 'UnAvailable', // Update the status of the specific time slot
                }
            },
            {
                arrayFilters: [{ 'slot._id': slotId }], // Filter to find the correct time slot
                new: true, // Return the updated document
            }
        );

        console.log('Availability updated:', savedAppointment);
        
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
        .populate('locationId', 'cityName hospitalName  pincode address') // Include fields you want from the Location model
        .sort({ appointmentDate: 1 });
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

exports.check = async (req, res) => {
    const { doctorId, date, slotId } = req.query;
    
    try {
        // Find the availability document for the specified doctor and date
        const availability = await Availability.findOne({
            doctorId: doctorId,
            availabilityDate: date, // Make sure to convert date to Date object
        });
        
        // Check if the availability document exists
        if (!availability) {
            return res.json({ isAvailable: false }); // Assume available if no availability document found
        }
        console.log(doctorId, date, slotId);

        // Iterate through the shifts and their timeSlots to find the status
        for (const shift of availability.shifts) {
            const timeSlot = shift.timeSlots.find(slot => slot._id.toString() === slotId);

            if (timeSlot) {
                // Check the status of the found timeSlot
                if (timeSlot.status === "Available") {
                    return res.json({ isAvailable: true });
                } else {
                    return res.json({ isAvailable: false });
                }
            }
        }

        // If slotId not found in any timeSlots, assume it is available
        return res.json({ isAvailable: true });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
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
        const appointment = await Appointment.findByIdAndUpdate(req.params.appointmentId, { status: 'Cancelled' }, { new: true , runValidators: true  });
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.json(appointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// exports.cancelAppointment = async (req, res) => {
//     const { appointmentId } = req.params;

//     try {
//         // Find and cancel the appointment
//         const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status: 'Cancelled' }, { new: true, runValidators: true });
        
//         if (!appointment) {
//             return res.status(404).json({ message: 'Appointment not found' });
//         }

//         // Extract necessary data from the appointment
//         const { doctorId, date, slotId } = appointment; // Ensure these fields exist in your Appointment model

//         // Update the corresponding slot status in Availability
//         const availability = await Availability.findOne({
//             doctorId: doctorId,
//             availabilityDate: new Date(date) // Convert string date to Date object
//         });

//         if (availability) {
//             for (const shift of availability.shifts) {
//                 const timeSlot = shift.timeSlots.find(slot => slot._id.toString() === slotId);

//                 if (timeSlot) {
//                     // Update the slot status to "Available"
//                     timeSlot.status = "Available";
//                     await availability.save(); // Save the changes to the Availability document
//                     break; // Exit the loop once the slot is found and updated
//                 }
//             }
//         }

//         res.json(appointment); // Return the cancelled appointment details
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };
