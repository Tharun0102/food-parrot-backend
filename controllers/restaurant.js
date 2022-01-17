const { Restaurant } = require('../models/restaurant');
const { User } = require('../models/user');
const { MenuItem } = require('../models/MenuItem');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const saltRounds = 10;

const registerRestaurant = async (req, res) => {
    const { name, password, address } = req.body;
    if (!name || !password || !address) {
        return res.status(400).send({ error: "invalid name or password or address" });
    }
    let restaurant = await Restaurant.findOne({ name });
    if (restaurant) {
        return res.status(400).send({ error: "Restuarant with this name already exists!" });
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    restaurant = new Restaurant({
        name,
        password: hash,
        address
    });
    await restaurant.save();

    const token = restaurant.generateAuthToken();
    res.header('x-auth-token', token);
    res.status(200).send(_.pick(restaurant, ['_id', 'name', 'address']));
}

const loginRestaurant = async (req, res) => {
    const { name, password } = req.body;
    const restaurant = await Restaurant.findOne({ name });
    bcrypt.compare(password, restaurant.password, function (err, result) {
        if (result === true) {
            const token = restaurant.generateAuthToken();
            res.header('x-auth-token', token);
            res.status(200).send(_.pick(restaurant, ['_id', 'name', 'address']));
        } else {
            res.status(400).send({ error: "Invalid Password!" });
        }
    })
}

const getAllRestaurants = async (req, res) => {
    const restaurantList = await Restaurant.find({});
    if (req.query.city) {
        let filteredRestaurants = restaurantList.filter((item) => item.address.city === req.query.city);
        filteredRestaurants = filteredRestaurants.map((item) => {
            const { _id, name, address } = item;
            return { id: _id, name, address };
        })
        return res.send(filteredRestaurants);
    }
    const response = restaurantList.map((item) => {
        const { _id, name, address } = item;
        return { id: _id, name, address };
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
    const { name, price } = req.body;
    if (!id || !name || !price) {
        return res.status(400).send({ error: "Insufficient Information!" })
    }
    const restaurantCheck = Restaurant.findOne({ _id: id })
    if (!restaurantCheck) {
        return res.status(401).send({ error: "No restaurant found!" });
    }
    const item = new MenuItem({
        name,
        price,
        restaurantId: id
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
    if (restaurant) res.send({ id: restaurant._id, name: restaurant.name });
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