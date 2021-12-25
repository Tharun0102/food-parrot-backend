const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    }
)

const User = mongoose.model('User', userSchema);

const validateUser = (payload) => {
    const schema = Joi.object({
        _id: Joi.required(),
        name: Joi.string().min(4).max(30).required(),
        password: Joi.string().min(4).max(30).required()
    })
    return schema.validate(payload);
}

module.exports = { User, validateUser };