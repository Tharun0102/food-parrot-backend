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
  description: {
    type: String
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
  },
  imageId: {
    type: String
  }
})

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

const validateMenuItem = (payload) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(30).required()
  })
  return schema.validate(payload);
}

module.exports = { MenuItem, validateMenuItem };