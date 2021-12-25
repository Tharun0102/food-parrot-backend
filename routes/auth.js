const express = require('express');
const { registerUser, loginUser } = require('../controllers/user');
const { loginRestaurant, registerRestaurant } = require('../controllers/restaurant');

const router = express.Router();

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.post('/restaurant/register', registerRestaurant);
router.post('/restaurant/login', loginRestaurant);

module.exports = router;