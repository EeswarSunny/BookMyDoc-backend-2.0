const Joi = require('joi');

// Define the validation schema using Joi
const validateRegistration = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().trim().escape().messages({
            'string.email': 'Please provide a valid email.',
            'any.required': 'Email is required.'
        }),
        role: Joi.string().valid('admin', 'doctor', 'user').required().trim().escape().messages({
            'any.required': 'Role is required.',
            'string.valid': 'Role must be one of the following: admin, doctor, or user.'
        }),
    });

    // Validate the incoming data against the schema
    const { error } = schema.validate(data);

    if (error) {
        return error.details.map(err => err.message); // Return validation errors
    }

    return null; // If no errors, return null
};

module.exports = {
    validateRegistration,
};
