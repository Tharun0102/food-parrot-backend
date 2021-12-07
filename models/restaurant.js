const mongoose = require('mongoose');

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

module.exports = Restaurant;