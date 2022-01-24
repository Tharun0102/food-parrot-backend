const mongoose = require('mongoose');

const schema = mongoose.Schema;

const orderschema = new schema({
  items: [
    {
      type: Object
    }
  ],
  status: {
    type: String,
    required: true,
    enum: ['Placed', 'Cancelled', 'Accepted', 'Completed', 'Out for Delivery'],
  },
  totalPrice: {
    type: Number,
    required: true
  },
  userId: {
    type: schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  restaurantId: {
    type: schema.Types.ObjectId,
    required: true,
    ref: "Restaurant",
  },
  address: {
    type: Object
  }
});

const Order = new mongoose.model('Order', orderschema);

module.exports = { Order };