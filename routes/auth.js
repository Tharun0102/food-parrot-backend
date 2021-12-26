const express = require('express');
const asyncMiddleware = require('../middlewares/async');
const { registerUser, loginUser } = require('../controllers/user');
const { loginRestaurant, registerRestaurant } = require('../controllers/restaurant');

const router = express.Router();

router.post('/user/register', asyncMiddleware(registerUser));
router.post('/user/login', asyncMiddleware(loginUser));
router.post('/restaurant/register', asyncMiddleware(registerRestaurant));
router.post('/restaurant/login', asyncMiddleware(loginRestaurant));

module.exports = router;