const Auth = require('../middlewares/Auth');
const asyncMiddleware = require('../middlewares/async');
const express = require('express');
const { getMenuItem } = require('../controllers/restaurant');
const { editMenuItem, deleteMenuItem } = require('../controllers/menuItem');

const router = express.Router();

router.get('/:id', Auth, asyncMiddleware(getMenuItem));
router.post('/:id', Auth, asyncMiddleware(editMenuItem));
router.delete('/:id', Auth, asyncMiddleware(deleteMenuItem));

module.exports = router;