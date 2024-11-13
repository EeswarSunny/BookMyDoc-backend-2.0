const Joi = require("joi");

// Joi validation and sanitization for OTP verification
const validateOtpVerification = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().trim().escape(),

    otp: Joi.string().length(6).required().trim().escape(),

    fullName: Joi.string().min(3).required().trim().escape(),

    password: Joi.string().min(8).required().trim().escape(),

    role: Joi.string().valid("admin", "doctor", "user").required().trim().escape(),
  });

  const { error } = schema.validate(data);

  if (error) {
    return error.details.map((err) => err.message);
  }

  return null;
};

module.exports = {
  validateOtpVerification,
};
