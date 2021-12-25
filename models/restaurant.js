const mongoose = require('mongoose');
const Joi = require('joi');

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
        type: String,
        required: true
    },
    menuItems: [{
        type: schema.Types.ObjectId,
        ref: 'MenuItem'
    }]
})

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