const Joi = require('joi');

// Joi validation schema for login
const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().trim().escape(),
        password: Joi.string().min(8).required().trim().escape(),
    });

    const { error } = schema.validate(data);

    if (error) {
        return error.details.map((err) => err.message);
    }

    return null;
};

module.exports = { validateLogin };
