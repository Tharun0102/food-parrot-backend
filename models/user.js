const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const schema = mongoose.Schema;
const userSchema = new schema({
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
        houseNo: String,
        street: String,
        city: String,
        zip: String,
        lat: Number,
        long: Number
    },
    cart: {
        items: [
            {
                id: {
                    type: schema.Types.ObjectId,
                    ref: "MenuItem",
                    required: true
                },
                quantity: { type: Number, required: true }
            }
        ],
        restaurantId: {
            type: schema.Types.ObjectId,
            ref: "Restaurant"
        }
    }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({
        id: this._id,
        name: this.name
    }, process.env.JWT_PRIVATE_KEY, { expiresIn: "10h" });
    return token;
}

userSchema.methods.addItem = function (id) {
    const updatedItems = [...this.cart.items];
    const itemIndex = updatedItems.findIndex((item) => {
        return id.toString() === item.id.toString();
    })
    if (itemIndex >= 0) updatedItems[itemIndex].quantity += 1;
    else updatedItems.push({ id, quantity: 1 })

    this.cart.items = updatedItems;
    return this.save();
};

userSchema.methods.removeItem = function (id) {
    let updatedItems = [...this.cart.items];
    const itemIndex = updatedItems.findIndex((item) => {
        return id.toString() === item.id.toString();
    })
    if (itemIndex >= 0) {
        updatedItems[itemIndex].quantity -= 1;
        if (updatedItems[itemIndex].quantity === 0) updatedItems = updatedItems.filter((item) => item.id.toString() !== id);
    }
    this.cart.items = updatedItems;
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
};

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