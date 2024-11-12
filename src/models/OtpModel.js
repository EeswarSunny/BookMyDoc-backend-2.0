const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expires: { 
        type: Date, 
        required: true,
        index: { expires: 0 } 
    },
});

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;
