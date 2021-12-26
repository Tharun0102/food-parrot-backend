const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const schema = mongoose.Schema;

const restaurantSchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zip: {
            type: String,
            required: true
        },
        lat: {
            type: Number
        },
        long: {
            type: Number
        }
    },

    menuItems: [{
        type: schema.Types.ObjectId,
        ref: 'MenuItem'
    }]
})

restaurantSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        id: this._id,
        name: this.name
    }, process.env.JWT_PRIVATE_KEY);
    return token;
}

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

const validateRestaurant = (payload) => {
    const schema = Joi.object({
        name: Joi.string().min(4).max(30).required(),
        password: Joi.string().min(4).max(30).required(),
        address: Joi.string()
    })
    return schema.validate(payload);
}

module.exports = { Restaurant, validateRestaurant };