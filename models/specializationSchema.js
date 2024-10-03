const mongoose = require ('mongoose')
const specializationSchema = new mongoose.Schema({
    specializationName: { type: String, required: true, unique: true },
    description: { type: String }

}, { timestamps: true });

module.exports = mongoose.model('Specialization', specializationSchema);
