const mongoose = require('mongoose');

const schema = mongoose.Schema;

const MenuItemSchema = new schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  ratings: {
    type: Number
  },
  ratingsCount: {
    type: Number
  },
  restaurantId: {
    type: schema.Types.ObjectId,
    required: true
  }
})

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

module.exports = MenuItem;