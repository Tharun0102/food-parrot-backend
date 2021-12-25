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
    try {
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
        res.status(200).send({
            id: user._id,
            name: user.name
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "something went wrong!" });
    }
}

const loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).send({ error: "invalid name or password" });
        }
        const user = await User.findOne({ name });
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            res.status(200).send({
                id: user._id,
                name: user.name
            });
        } else {
            res.status(400).send({ error: "Invalid Password!" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(404).send({ error: "user doesn't exist!" })
    }
}

const getUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ error: "invalid user id!" });
    }
    try {
        const user = await User.findOne({ _id: id });
        if (user) res.send({ id: user._id, name: user.name });
        else res.status(404).send({ error: "user not found!" })
    } catch (err) {
        res.status(404).send({ error: "user doesn't exist!" })
    }
}

const editUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ error: "invalid user id!" });
    }
    try {
        User.findByIdAndUpdate(id, req.body, (err, user) => {
            if (err) {
                return res.status(500).send({ error: "Error while Updating the User, try again!" })
            };
            res.status(201).send({ success: "User updated successfully." });
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ error: "something went wrong!" })
    }
}

module.exports = { loginUser, registerUser, getUser, editUser };