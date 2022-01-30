const Auth = require('../middlewares/Auth');
const asyncMiddleware = require('../middlewares/async');
const express = require('express');
const { getAllRestaurants, editRestaurant, addMenuItem, getMenuItems, getRestaurant, getRestaurantStats } = require('../controllers/restaurant');

const router = express.Router();

router.post('/all', asyncMiddleware(getAllRestaurants));
router.get('/:id', asyncMiddleware(getRestaurant));
router.post('/:id', Auth, asyncMiddleware(editRestaurant));
router.get('/:id/all', asyncMiddleware(getMenuItems));
router.get('/:id/stats', asyncMiddleware(getRestaurantStats));
router.post('/:id/addItem', Auth, asyncMiddleware(addMenuItem));
router.post('/:id/addItem', Auth, asyncMiddleware(addMenuItem));


module.exports = router;