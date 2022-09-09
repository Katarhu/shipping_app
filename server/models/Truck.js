const mongoose = require('mongoose');

const TruckSchema = mongoose.Schema({
    created_by: {type: String },
    assigned_to: { type: String, default: null},
    payload: { type: Number},
    type: {  type: String },
    status: { type: String, default: "" },
    dimensions: {
        width: { type: Number },
        length: { type: Number },
        height: { type: Number },
    }
}, { timestamps: {
        createdAt: "created_date",
        updatedAt: "updated_date"
    } });


module.exports = {
    Truck: mongoose.model('Truck', TruckSchema),
}