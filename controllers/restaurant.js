const { Restaurant } = require('../models/restaurant');
const { Order } = require('../models/Order');
const { MenuItem } = require('../models/MenuItem');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const saltRounds = 10;
const path = require('path');
const fs = require('fs');
const { destroyFile } = require('../utils/cloudinary');

const registerRestaurant = async (req, res) => {
    const { name, email, password, city, street, zip, imageId } = req.body;
    if (!name || !email || !password) {
        return res.status(400).send({ error: "invalid name or password" });
    }
    if (!imageId) {
        return res.status(400).send({ error: "image required!" });
    }
    let restaurant = await Restaurant.findOne({ email });
    if (restaurant) {
        return res.status(400).send({ error: "Restuarant with this email already exists!" });
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
        rating: 0.0,
        ratingsCount: 0,
        imageId,
        wallet: 0
    });
    await restaurant.save();

    const token = restaurant.generateAuthToken();
    res.header('x-auth-token', token);
    res.status(200).send({ ..._.pick(restaurant, ['_id', 'name', 'email', 'address', 'imageId', 'wallet']), token });
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
            res.status(200).send({ ..._.pick(restaurant, ['_id', 'name', 'email', 'address', 'imageId', 'rating', 'ratingsCount', 'wallet']), token });
        } else {
            res.status(400).send({ error: "Invalid Password!" });
        }
    })
}

const getAllRestaurants = async (req, res) => {
    const page = req.body.page || 1;
    const limit = req.body.limit || 12;
    const search = req.body.search;
    const toSkip = (page - 1) * limit;
    if (search) {
        const searchFilter = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { 'address.city': { $regex: search, $options: 'i' } },
                { 'address.street': { $regex: search, $options: 'i' } }
            ]
        };
        let filteredRestaurants = await Restaurant.find(searchFilter).skip(toSkip).limit(limit);
        const total = await Restaurant.find(searchFilter).count();
        filteredRestaurants = filteredRestaurants.map((item) => {
            return _.pick(item, ['_id', 'name', 'address', 'rating', 'ratingsCount', 'imageId']);
        })
        return res.send({ total, restaurants: filteredRestaurants });
    }
    const restaurants = await Restaurant.find({}).skip(toSkip).limit(limit);
    const total = await Restaurant.find({}).count();
    const response = restaurants.map((item) => {
        return _.pick(item, ['_id', 'name', 'address', 'rating', 'ratingsCount', 'imageId']);
    })
    res.status(200).send({ total, restaurants: response });
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
    const { name, description, price, imageId } = req.body;
    if (!id || !name || !price) {
        return res.status(400).send({ error: "Insufficient Information!" })
    }
    const restaurantCheck = await Restaurant.findOne({ _id: id })
    if (!restaurantCheck) {
        return res.status(401).send({ error: "No restaurant found!" });
    }
    if (!imageId) {
        return res.status(401).send({ error: "image required!" });
    }
    const item = new MenuItem({
        name,
        description,
        price,
        restaurantId: id,
        imageId
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
    if (restaurant) res.send(_.pick(restaurant, ['_id', 'name', 'email', 'address', 'imageId', 'rating', 'ratingsCount']));
    else res.status(404).send({ error: "restaurant not found!" })
}

const getRestaurantStats = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ error: "invalid restaurant id!" });
    }
    const stats = await getStats(id);
    res.send(stats);
}

const getStats = async (id) => {
    const total = await Order.find({ restaurantId: id }).count();
    const totalToday = await Order.find({
        restaurantId: id,
        createdDate: new Date().getDate()
    }).count();

    const totalMonthly = await Order.find({
        restaurantId: id,
        createdMonth: new Date().getMonth()
    }).count();
    const completed = await Order.find({ restaurantId: id, status: 'Completed' }).count();
    const completedToday = await Order.find({
        restaurantId: id, status: 'Completed',
        createdDate: new Date().getDate()
    }).count();
    const completedMonthly = await Order.find({
        restaurantId: id,
        status: 'Completed',
        createdMonth: new Date().getMonth()
    }).count();
    const cancelled = await Order.find({
        restaurantId: id,
        status: 'Cancelled'
    }).count();
    const cancelledToday = await Order.find({
        restaurantId: id,
        status: 'Cancelled',
        createdDate: new Date().getDate()
    }).count();
    const cancelledMonthly = await Order.find({
        restaurantId: id,
        status: 'Cancelled',
        createdMonth: new Date().getMonth()
    }).count();
    return {
        total,
        totalToday,
        totalMonthly,
        completed,
        completedToday,
        completedMonthly,
        cancelled,
        cancelledToday,
        cancelledMonthly
    }
}

const editRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    const token = req.header('x-auth-token');
    res.header('x-auth-token', token);
    if (req.body.paymentAmount) {
        try {
            const rest = await Restaurant.findByIdAndUpdate(id,
                { wallet: restaurant.wallet + req.body.paymentAmount },
                { new: true });
            return res.send({ ..._.pick(rest, ['_id', 'name', 'email', 'address', 'imageId', 'rating', 'ratingsCount', 'wallet']), token });
        } catch (error) {
            console.log(error);
            return res.status(500).send("couldn't update")
        }
    } else {
        const { city, street, zip } = req.body;
        if (!id || !restaurant) {
            return res.status(404).send({ error: "No Restaurant found!" });
        }
        let changes = { ...req.body };
        changes.address = {
            city,
            street,
            zip
        };
        if (req.body.imageId) {
            changes.imageId = req.body.imageId;
            await destroyFile(restaurant.imageId);
        }

        Restaurant.findByIdAndUpdate(req.params.id, changes, { new: true }, (err, restaurant) => {
            if (err) {
                return res.status(500).send({ error: "Error while Updating the Restaurant, try again!" })
            };
            res.send({ ..._.pick(restaurant, ['_id', 'name', 'email', 'address', 'imageId', 'rating', 'ratingsCount', 'wallet']), token });
        })
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
    getMenuItem,
    getRestaurantStats
};