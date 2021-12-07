const express = require('express');
const { getMenuItems, addMenuItem } = require('../controllers/restaurant');

const router = express.Router();

router.post('/:id/all', getMenuItems);
router.post('/:id/new', addMenuItem);

module.exports = router;