const express = require('express');
const { getCustomer, registerCustomer } = require('../controllers/user');
const { getAllRestaurants } = require('../controllers/restaurant');

const router = express.Router();

router.get('/all', getAllRestaurants);



module.exports = router;