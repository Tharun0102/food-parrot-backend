const express = require('express');
const { getMenuItems, getMenuItem } = require('../controllers/restaurant');

const router = express.Router();

router.get('/:id', getMenuItem);

module.exports = router;