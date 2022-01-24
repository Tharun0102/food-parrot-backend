const Auth = require('../middlewares/Auth');
const asyncMiddleware = require('../middlewares/async');
const express = require('express');
const { getAllRestaurants, editRestaurant, addMenuItem, getMenuItems, getRestaurant } = require('../controllers/restaurant');
const { imageUpload } = require('../storage');

const router = express.Router();

router.get('/all', asyncMiddleware(getAllRestaurants));
router.get('/:id', asyncMiddleware(getRestaurant));
router.post('/:id', Auth, asyncMiddleware(editRestaurant));
router.get('/:id/all', asyncMiddleware(getMenuItems));
router.post('/:id/addItem', Auth, imageUpload.single('image'), asyncMiddleware(addMenuItem));


module.exports = router;