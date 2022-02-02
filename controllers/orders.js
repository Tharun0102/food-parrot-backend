const _ = require("lodash");
const mongoose = require('mongoose');
const { User } = require('../models/user');
const { Restaurant } = require('../models/restaurant');
const { Order } = require("../models/Order");

const createOrder = async (req, res) => {
  const { userId, restaurantId, items, order_status, address, mobile, paymentMode } = req.body;
  const user = await User.findById(userId);
  if (!userId || !user) {
    return res.status(400).send({ error: "invalid user id!" });
  }
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return res.status(400).send({ error: "invalid restaurant id!" });
  }
  let totalPrice = 0;
  for (let item of items) {
    totalPrice += item.count * item.price;
  }
  const order = new Order({
    items,
    status: order_status,
    userId: mongoose.Types.ObjectId(userId),
    restaurantId: mongoose.Types.ObjectId(restaurantId),
    totalPrice,
    address,
    mobile,
    rating: 0.0,
    createdDate: new Date().getDate(),
    createdMonth: new Date().getMonth(),
    paymentMode
  });
  await order.save();

  return res.status(200).send(_.pick(order, ['_id', 'items', 'status', 'paymentMode']))
}

const editOrder = async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (req.body.rating) {
    const restaurant = await Restaurant.findById(order.restaurantId);
    const currentRating = order.rating;
    const newRating = req.body.rating;

    const sum = restaurant.rating * restaurant.ratingsCount +
      (currentRating > 0 ? newRating - currentRating : newRating);
    const total = restaurant.ratingsCount + (currentRating == 0 ? 1 : 0);
    const avg = sum / total;

    restaurant.rating = avg;
    restaurant.ratingsCount = total;
    await restaurant.save();
  }
  Order.findByIdAndUpdate(orderId, req.body, { new: true }, (err, order) => {
    if (err) {
      return res.status(500).send({ error: "Error while Updating the order, try again!" })
    };
    res.status(200).send("order updated!");
  })
}

const getOrders = async (req, res) => {
  const { type, id } = req.body;
  if (type != 'USER' && type != 'RESTAURANT') {
    return res.status(400).send({ error: "invalid user type!" });
  }
  let user, orders;
  if (type == 'USER') {
    user = await User.findById(id);
    orders = await Order.find({ userId: id });
  } else {
    user = await Restaurant.findById(id);
    orders = await Order.find({ restaurantId: id });
  }
  if (req.body.status) {
    orders = orders.filter((order) => order.status == req.body.status);
  }

  if (!user) {
    return res.status(400).send({ error: "user doesn't exist!" });
  }
  const response = await Promise.all(orders.map(async (order) => {
    await order.populate('userId');
    await order.populate('restaurantId');
    return {
      ..._.pick(order, [
        '_id',
        'items',
        'userId._id',
        'userId.name',
        'restaurantId._id',
        'restaurantId.name',
        'restaurantId.address',
        'status',
        'address',
        'mobile',
        'rating',
        'paymentMode'
      ]), createdAt: order._id.getTimestamp()
    };
  }))
  return res.status(200).send(response)
}

module.exports = {
  createOrder,
  editOrder,
  getOrders
}