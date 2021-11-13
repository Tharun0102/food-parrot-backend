const express = require('express');
const { getCustomer,registerCustomer } = require('../controllers/customercontrol');
const {getRestaurant,registerRestaurant} = require('../controllers/restaruntcontrol');

const router = express.Router();

router.post('/register-customer',registerCustomer);
router.post('/register-restaurant',registerRestaurant);
router.post('/customer-login',getCustomer);
router.post('/restaurant-login',getRestaurant);

module.exports=router;