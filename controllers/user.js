const _ = require("lodash");
const { User } = require('../models/user');
const { MenuItem } = require('../models/MenuItem');

const bcrypt = require('bcrypt');
const { Order } = require('../models/Order');
const saltRounds = 10;

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (email?.length < 2 || password?.length < 2) {
        res.status(400).send({ error: "invalid user email or password" });
        return;
    }
    let user = await User.findOne({ email });
    if (user) {
        res.status(400).send({ error: "User with this email already exists!" });
        return;
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    user = new User({
        name,
        email,
        password: hash
    });
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token);
    res.status(200).send({ ..._.pick(user, ['_id', 'name', 'email', 'address']), token });
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (email?.length < 2 || password?.length < 2) {
        return res.status(400).send({ error: "invalid email or password" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ error: "user doesn't exist!" })

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        const token = user.generateAuthToken();
        res.header('x-auth-token', token);
        res.status(200).send({ ..._.pick(user, ['_id', 'name', 'email', 'address']), token });
    } else {
        res.status(400).send({ error: "Invalid Password!" });
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (user) res.send(_.pick(user, ['_id', 'name', 'email', 'address']));
    else res.status(404).send({ error: "user not found!" })
}

const editUser = async (req, res) => {
    const { id } = req.params;
    const token = req.header('x-auth-token');
    res.header('x-auth-token', token);
    User.findByIdAndUpdate(id, req.body, { new: true }, (err, user) => {
        if (err || !user) {
            return res.status(500).send({ error: "Error while Updating the User, try again!" })
        };
        res.status(200).send({ ..._.pick(user, ['_id', 'name', 'email', 'address']), token });
    })
}

const updateCart = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(400).send({ error: "invalid user!" });
    }
    const { type, itemId } = req.body;
    const item = await MenuItem.findById(itemId);
    if (!item) {
        return res.status(400).send({ error: "invalid item id!" });
    }
    if (type === 'ADD_ITEM') {
        await user.addItem(itemId);
    } else if (type === 'REMOVE_ITEM') {
        await user.removeItem(itemId);
    } else {
        return res.status(400).send(`unknown operation type: ${type}`)
    }
    res.status(200).send("cart updated succesfully!")
}

const getCart = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(400).send({ error: "invalid user id!" });
    }
    await user.populate('cart.items.id');
    const items = user.cart.items;
    let totalPrice = 0;
    for (let item of items) {
        totalPrice += item.quantity * item.id.price;
    }
    let response = [];
    items.forEach((item) => {
        response.push(_.pick(item, ['id._id', 'id.name', 'id.price', 'quantity']))
    })
    return res.status(200).send({ response, totalPrice })
}

module.exports = {
    loginUser,
    registerUser,
    getUser,
    editUser,
    updateCart,
    getCart
};