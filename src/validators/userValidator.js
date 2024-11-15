const Joi = require('joi');
const validator = require('validator'); 

const validateRegistration = (data) => {
    // Escape input data to prevent HTML injections
    data.email = validator.escape(data.email);
    data.role = validator.escape(data.role);
    console.log(data);
    const schema = Joi.object({
        email: Joi.string().email().required().trim().messages({
            'string.email': 'Please provide a valid email.',
            'any.required': 'Email is required.'
        }),
        role: Joi.string().valid('admin', 'doctor', 'user').required().trim().messages({
            'any.required': 'Role is required.',
            'string.valid': 'Role must be one of the following: admin, doctor, or user.'
        }),
    }).unknown(true);

    const { error } = schema.validate(data);

    if (error) {
        return error.details.map(err => err.message); 
    }

    return null; 
};


// Joi validation and sanitization for OTP verification
const validateOtpVerification = (data) => {
    const schema = Joi.object({
      email: Joi.string().email().required().trim(),
  
      otp: Joi.string().length(6).required().trim(),
  
      fullName: Joi.string().min(3).required().trim(),
  
      password: Joi.string().min(8).required().trim(),
  
      role: Joi.string().valid("admin", "doctor", "user").required().trim(),
    });
  
    const { error } = schema.validate(data);
  
    if (error) {
      return error.details.map((err) => err.message);
    }
  
    return null;
  };
  
  // Joi validation schema for login
const validateLogin = (data) => {
    data.email = validator.escape(data.email); 
    data.password = validator.escape(data.password);

    const schema = Joi.object({
        email: Joi.string().email().required().trim().messages({
            'string.email': 'Please provide a valid email.',
            'any.required': 'Email is required.',
        }),
        password: Joi.string().min(8).required().trim().messages({
            'string.min': 'Password must be at least 8 characters long.',
            'any.required': 'Password is required.',
        }),
    });

    const { error } = schema.validate(data);

    if (error) {
        return error.details.map((err) => err.message); 
    }

    return null;
};

module.exports = {
    validateRegistration, validateOtpVerification, validateLogin
};
