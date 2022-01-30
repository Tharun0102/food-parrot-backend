const Auth = require('../middlewares/Auth');
const asyncMiddleware = require('../middlewares/async');
const express = require('express');
const { getAllRestaurants, editRestaurant, addMenuItem, getMenuItems, getRestaurant, getRestaurantStats } = require('../controllers/restaurant');
const { imageUpload } = require('../storage');

const router = express.Router();

router.post('/all', asyncMiddleware(getAllRestaurants));
router.get('/:id', asyncMiddleware(getRestaurant));
router.post('/:id', Auth, imageUpload.single('image'), asyncMiddleware(editRestaurant));
router.get('/:id/all', asyncMiddleware(getMenuItems));
router.get('/:id/stats', asyncMiddleware(getRestaurantStats));
router.post('/:id/addItem', Auth, imageUpload.single('image'), asyncMiddleware(addMenuItem));


module.exports = router;