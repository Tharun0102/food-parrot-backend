const { Restaurant } = require('../models/restaurant');
const { User } = require('../models/user');
const { MenuItem } = require('../models/MenuItem');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const saltRounds = 10;

const registerRestaurant = async (req, res) => {
    const { name, email, password, city, street, zip } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send({ error: "invalid name or password" });
    }
    if (!req.file) {
        return res.status(400).send({ error: "image required!" });
    }
    let restaurant = await Restaurant.findOne({ email });
    if (restaurant) {
        return res.status(400).send({ error: "Restuarant with this name already exists!" });
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    restaurant = new Restaurant({
        name,
        email,
        password: hash,
        address: {
            city, street, zip
        },
        imageUrl: req.file.path
    });
    await restaurant.save();

    const token = restaurant.generateAuthToken();
    res.header('x-auth-token', token);
    res.status(200).send({ ..._.pick(restaurant, ['_id', 'name', 'email', 'address']), token });
}

const loginRestaurant = async (req, res) => {
    const { email, password } = req.body;
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
        return res.status(400).send({ error: "Invalid email or Password!" });
    }
    bcrypt.compare(password, restaurant.password, function (err, result) {
        if (result === true) {
            const token = restaurant.generateAuthToken();
            res.header('x-auth-token', token);
            res.status(200).send({ ..._.pick(restaurant, ['_id', 'name', 'email', 'address']), token });
        } else {
            res.status(400).send({ error: "Invalid Password!" });
        }
    })
}

const getAllRestaurants = async (req, res) => {
    const restaurantList = await Restaurant.find({});
    if (req.query.search) {
        const text = req.query.search
        let filteredRestaurants = restaurantList.filter((item) => {
            return item.name.includes(text) || item.address.city.includes(text) || item.address.street.includes(text);
        });
        filteredRestaurants = filteredRestaurants.map((item) => {
            return _.pick(item, ['_id', 'name', 'address', 'rating', 'imageUrl']);
        })
        return res.send(filteredRestaurants);
    }
    const response = restaurantList.map((item) => {
        return _.pick(item, ['_id', 'name', 'address', 'rating', 'imageUrl']);
    })
    res.status(200).send(response);
}

const getMenuItems = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).send({ error: "Invalid restaurant id!" });
    }
    const items = await MenuItem.find({ restaurantId: id });
    res.status(200).send(items);
}

const getMenuItem = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).send({ error: "invalid menu id" })
    const item = await MenuItem.findOne({ _id: id });
    if (item) res.status(200).send(item);
    else res.status(404).send({ error: "menuItem not found!" });
}

const addMenuItem = async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    console.log(req.file, req.body);
    if (!id || !name || !price) {
        return res.status(400).send({ error: "Insufficient Information!" })
    }
    if (!req.file) {
        return res.status(400).send({ error: "Image required!" })
    }
    const restaurantCheck = await Restaurant.findOne({ _id: id })
    if (!restaurantCheck) {
        return res.status(401).send({ error: "No restaurant found!" });
    }
    const item = new MenuItem({
        name,
        description,
        price,
        restaurantId: id,
        imageUrl: req.file.path
    });
    await item.save();
    res.status(200).send({ success: "added item successfully!" });
}

const getRestaurant = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ error: "invalid restaurant id!" });
    }
    const restaurant = await Restaurant.findOne({ _id: id });
    if (restaurant) res.send(_.pick(restaurant, ['_id', 'name', 'email', 'address']));
    else res.status(404).send({ error: "restaurant not found!" })
}

const editRestaurant = async (req, res) => {
    Restaurant.findByIdAndUpdate(req.params.id, req.body, (err, restaurant) => {
        if (err) {
            return res.status(500).send({ error: "Error while Updating the Restaurant, try again!" })
        };
        res.send({ success: "Restaurant updated successfully." });
    })
}

module.exports = {
    registerRestaurant,
    loginRestaurant,
    getRestaurant,
    getAllRestaurants,
    getMenuItems,
    addMenuItem,
    editRestaurant,
    getMenuItem
};