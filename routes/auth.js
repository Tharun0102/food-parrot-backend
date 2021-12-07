const express = require('express');
const { registerUser, getUser } = require('../controllers/user');
const { getRestaurant, registerRestaurant } = require('../controllers/restaurant');

const router = express.Router();

router.post('/user/register', registerUser);
router.post('/user/login', getUser);
router.post('/restaurant/register', registerRestaurant);
router.post('/restaurant/login', getRestaurant);

module.exports = router;