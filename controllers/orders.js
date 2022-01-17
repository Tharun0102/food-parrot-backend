const _ = require("lodash");
const mongoose = require('mongoose');
const { User } = require('../models/user');
const { Restaurant } = require('../models/restaurant');
const { Order } = require("../models/Order");

const createOrder = async (req, res) => {
  const { userId, restaurantId, items, order_status } = req.body;
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
    totalPrice += item.quantity * item.item.price;
  }
  const order = new Order({
    items,
    status: order_status,
    userId: mongoose.Types.ObjectId(userId),
    restaurantId: mongoose.Types.ObjectId(restaurantId),
    totalPrice
  });
  await order.save();

  return res.status(200).send(_.pick(order, ['_id', 'items', 'status']))
}

const editOrder = async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!orderId || !order) {
    return res.status(400).send({ error: "invalid orderId!" });
  }
  order.status = req.body.order_status;
  await order.save();
  return res.status(200).send(_.pick(order, ['_id', 'items', 'status']))
}

const getOrders = async (req, res) => {
  const { type, id } = req.body;
  if (type != 'USER' && type != 'RESTAURANT') {
    return res.status(400).send({ error: "invalid user type!" });
  }
  if (!id) {
    return res.status(400).send({ error: "invalid id!" });
  }
  let user, orders;
  if (type == 'USER') {
    user = await User.findById(id);
    orders = await Order.find({ userId: id });
  } else {
    user = await Restaurant.findById(id);
    orders = await Order.find({ restaurantId: id });
  }

  if (!user) {
    return res.status(400).send({ error: "user doesn't exist!" });
  }
  const response = await Promise.all(orders.map(async (order) => {
    await order.populate('userId');
    await order.populate('restaurantId');
    return _.pick(order, [
      '_id',
      'items',
      'userId._id',
      'userId.name',
      'restaurantId._id',
      'restaurantId.name',
      'restaurantId.address',
      'status'
    ]);
  }))
  return res.status(200).send(response)
}

module.exports = {
  createOrder,
  editOrder,
  getOrders
}