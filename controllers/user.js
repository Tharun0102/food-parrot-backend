const Joi = require('joi');
const { User, validateUser } = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const registerUser = async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        res.status(400).send({ error: "invalid user name or password" });
        return;
    }
    let user = await User.findOne({ name: name });
    if (user) {
        res.status(400).send({ error: "User with this name already exists!" });
        return;
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    user = new User({
        name,
        password: hash
    });
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token);
    res.status(200).send({
        id: user._id,
        name: user.name
    });
}

const loginUser = async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).send({ error: "invalid name or password" });
    }
    const user = await User.findOne({ name });
    if (!user) return res.status(404).send({ error: "user doesn't exist!" })

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        const token = user.generateAuthToken();
        res.header('x-auth-token', token);
        res.status(200).send({
            id: user._id,
            name: user.name
        });
    } else {
        res.status(400).send({ error: "Invalid Password!" });
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ error: "invalid user id!" });
    }
    const user = await User.findOne({ _id: id });
    if (user) res.send({ id: user._id, name: user.name });
    else res.status(404).send({ error: "user not found!" })
}

const editUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ error: "invalid user id!" });
    }
    User.findByIdAndUpdate(id, req.body, (err, user) => {
        if (err) {
            return res.status(500).send({ error: "Error while Updating the User, try again!" })
        };
        res.status(201).send({ success: "User updated successfully." });
    })
}

module.exports = { loginUser, registerUser, getUser, editUser };