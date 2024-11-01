const mongoose = require ('mongoose');
const locationModel = new mongoose.Schema({
    hospitalName: { type: String, required: true, trim: true },
    mandal: { 
        name: { type: String, required: true },
        mandalId: { type: mongoose.Schema.Types.ObjectId },
    },
    district: {
        name: { type: String, required: true },
        districtId: { type: mongoose.Schema.Types.ObjectId },
    },
    state: {
        name: { type: String, required: true },
        stateId: { type: mongoose.Schema.Types.ObjectId },
    },
    pincode: { type: String, required: true, match: /^[0-9]{6}$/ },
    address: { type: String },
    cityName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Location', locationModel);
