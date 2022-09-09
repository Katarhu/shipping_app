const mongoose = require('mongoose');
const Joi = require('joi');

const UserSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true },
    imgUrl: { type: String, default: ''},
    password: { type: String, required: true},
    role: {  type: String, default: 'SHIPPER' }
}, { timestamps: {
        createdAt: "created_date",
        updatedAt: "updated_date"
    } });

const UserJoi = Joi.object({
    email: Joi.string()
        .required(),
    password: Joi.string()
        .required()
})

module.exports = {
    User: mongoose.model('User', UserSchema),
    UserJoi
}