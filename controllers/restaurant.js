const { Restaurant } = require('../models/restaurant');
const { User } = require('../models/user');
const { MenuItem } = require('../models/MenuItem');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const registerRestaurant = async (req, res) => {
    const { name, password, address } = req.body;
    if (!name || !password || !address) {
        return res.status(400).send({ error: "invalid name or password or address" });
    }
    try {
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
        res.status(200).send({
            id: restaurant._id,
            name: restaurant.name
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ error: "something went wrong!" });
    }
}

const loginRestaurant = async (req, res) => {
    const { name, password } = req.body;
    try {
        const restaurant = await Restaurant.findOne({ name });
        bcrypt.compare(password, restaurant.password, function (err, result) {
            if (result === true) {
                res.status(200).send({
                    id: restaurant._id,
                    name: restaurant.name
                });
            } else {
                res.status(400).send({ error: "Invalid Password!" });
            }
        })
    } catch (err) {
        res.status(404).send({ error: "Restaurant doesn't exist!" })
    }
}

const getAllRestaurants = async (req, res) => {
    try {
        if (req.params.area) {
            console.log(global.navigator.geolocation, "location");
        }
        const restaurantList = await Restaurant.find({});
        const response = restaurantList.map((item) => {
            return {
                id: item._id,
                name: item.name
            }
        })
        res.status(200).send(response);
    } catch (err) {
        res.status(404).send({ error: "Can't fetch restaurants!" });
    }
}

const getMenuItems = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).send({ error: "Invalid restaurant id!" });
        }
        const items = await MenuItem.find({ restaurantId: id });
        res.status(200).send(items);
    } catch (err) {
        res.status(404).send({ error: "Can't fetch menuItems!" });
    }
}

const getMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send({ error: "invalid menu id" })
        const item = await MenuItem.findOne({ _id: id });
        if (item) res.status(200).send(item);
        else res.status(404).send({ error: "menuItem not found!" });
    } catch (err) {
        res.status(404).send({ error: "Can't find required item!" });
    }
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
    try {
        const item = new MenuItem({
            name,
            price,
            restaurantId: id
        });
        await item.save();
        res.status(200).send({ success: "added item successfully!" });
    } catch (err) {
        res.status(500).send({ error: "Can't add this item!" });
    }
}

const getRestaurant = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ error: "invalid restaurant id!" });
    }
    try {
        const restaurant = await Restaurant.findOne({ _id: id });
        if (restaurant) res.send({ id: restaurant._id, name: restaurant.name });
        else res.status(404).send({ error: "restaurant not found!" })
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "something went wrong!" })
    }
}

const editRestaurant = async (req, res) => {
    try {
        Restaurant.findByIdAndUpdate(req.params.id, req.body, (err, restaurant) => {
            if (err) {
                return res.status(500).send({ error: "Error while Updating the Restaurant, try again!" })
            };
            res.send({ success: "Restaurant updated successfully." });
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "something went wrong!" })
    }
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