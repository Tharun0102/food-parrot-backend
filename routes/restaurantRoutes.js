const express = require('express');
const { getAllRestaurants, editRestaurant, addMenuItem, getMenuItems, getRestaurant } = require('../controllers/restaurant');

const router = express.Router();

router.get('/all', getAllRestaurants);
router.get('/:id', getRestaurant);
router.post('/:id', editRestaurant);
router.get('/:id/all', getMenuItems);
router.post('/:id/addItem', addMenuItem);


module.exports = router;