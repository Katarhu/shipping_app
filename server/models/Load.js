const mongoose = require('mongoose');
const Joi = require('joi');

const LoadSchema = mongoose.Schema({
    created_by: {type: String },
    assigned_to: { type: String, default: null},
    status: { type: String, default: 'NEW'},
    state: { type: String, default: 'En route to Pick Up' },
    name: { type: String, required: true },
    payload: { type: Number },
    pickup_address: { type: String },
    delivery_address: { type: String },
    dimensions: {
        width: {type: Number},
        length: {type: Number},
        height: {type: Number}
    },
    logs: [{
        message: {type: String},
        time: {type: String}
    }]
}, { timestamps: {
        createdAt: "created_date",
        updatedAt: "updated_date"
}});

const LoadJoi = Joi.object({
    name: Joi.string()
        .required(),
    payload: Joi.number()
        .required(),
    pickup_address: Joi.string()
        .required(),
    delivery_address: Joi.string()
        .required(),
    width: Joi.number()
        .required(),
    length: Joi.number()
        .required(),
    height: Joi.number()
        .required()
})

module.exports = {
    Load: mongoose.model('Load', LoadSchema),
    LoadJoi
}