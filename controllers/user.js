const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const registerUser = async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        res.status(400).send("invalid user name or password");
        return;
    }
    const userCheck = await User.findOne({ name: name });
    if (userCheck) {
        res.status(400).send("User with this name already exists!");
        return;
    }
    bcrypt.hash(password, saltRounds, function (err, hash) {
        storeUser(name, hash, res)
    });
}

const storeUser = async (name, password, res) => {
    try {
        const newUser = new User({
            name,
            password
        });
        await newUser.save();
        res.status(201).send("user registered succesfully!");
    } catch (err) {
        console.log(err);
        res.status(500).send("error!")
    }
}

const getUser = async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.findOne({ name });
        bcrypt.compare(password, user.password, function (err, result) {
            if (result === true) {
                res.status(200).send(user);
            } else {
                res.status(400).send("Invalid Password!");
            }
        })
    } catch (err) {
        res.status(404).send("user doesn't exist!")
    }
}


module.exports = { getUser, registerUser };