const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true, unique: true },
    fullName: { type: String, required: true, trim: true, unique: true },
    encPassword: { type: String, required: true },
    role: { type: String, enum: ['user', 'doctor','admin'], default: 'user' } ,// Added role field
});

module.exports = mongoose.model('User', userSchema);
