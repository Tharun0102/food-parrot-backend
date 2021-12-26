const Auth = require('../middlewares/Auth');
const asyncMiddleware = require('../middlewares/async');
const express = require('express');
const { getMenuItems, getMenuItem } = require('../controllers/restaurant');

const router = express.Router();

router.get('/:id', Auth, asyncMiddleware(getMenuItem));

module.exports = router;