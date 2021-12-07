const Restaurant = require('../models/restaurant');
const User = require('../models/user');
const MenuItem = require('../models/MenuItem');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const registerRestaurant = async (req, res) => {
    const { name, password, address } = req.body;
    if (!name || !password || !address) {
        res.status(400).send("invalid name or password");
        return;
    }
    const userCheck = await User.findOne({ name: name });
    if (userCheck) {
        res.status(400).send("Restaurant already exists with this name!");
        return;
    }
    bcrypt.hash(password, saltRounds, function (err, hash) {
        storeRestaurant(name, hash, address, res)
    });
}

const storeRestaurant = async (name, password, address, res) => {
    try {
        const newRestaurant = new Restaurant({
            name,
            password,
            address
        });
        await newRestaurant.save();
        res.status(201).send("Restaurant registered succesfully!");
    } catch (err) {
        console.log(err);
        res.status(500).send("error!")
    }
}

const getRestaurant = async (req, res) => {
    const { name, password } = req.body;
    try {
        const restaurant = await Restaurant.findOne({ name });
        bcrypt.compare(password, restaurant.password, function (err, result) {
            if (result === true) {
                res.status(200).send(restaurant);
            } else {
                res.status(400).send("Invalid Password!");
            }
        })
    } catch (err) {
        res.status(404).send("Restaurant doesn't exist!")
    }
}

const getAllRestaurants = async (req, res) => {
    try {
        const restaurantList = await Restaurant.find({});
        res.status(200).send(restaurantList);
    } catch (err) {
        res.status(404).send("Can't fetch restaurants!");
    }
}

const getMenuItems = async (req, res) => {
    const { restaurantId } = req.body;
    try {
        const items = await MenuItem.find({ restaurantId });
        console.log("items", items);
        res.status(200).send(items);
    } catch (err) {
        res.status(404).send("Can't fetch menuItems!");
    }
}

const addMenuItem = async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    if (!id || !name || !price) {
        return res.status(400).send("Insufficient Information!")
    }
    const restaurantCheck = Restaurant.findOne({ _id: id })
    if (!restaurantCheck) {
        return res.status(401).send("No restaurant found!");
    }
    try {
        const item = new MenuItem({
            name,
            price,
            restaurantId: id
        });
        await item.save();
        res.status(200).send("added item successfully!");
    } catch (err) {
        res.status(500).send("Can't add this item!");
    }
}


module.exports = { registerRestaurant, getRestaurant, getAllRestaurants, getMenuItems, addMenuItem };