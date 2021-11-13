const mongoose = require('mongoose');


const restaurantSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        restaurantname: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    }
)

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;