const Auth = require('../middlewares/Auth');
const asyncMiddleware = require('../middlewares/async');
const express = require('express');
const {
  editUser,
  getUser,
  getCart,
  updateCart
} = require('../controllers/user');

const router = express.Router();

router.post('/:id/edit', Auth, asyncMiddleware(editUser));
router.get('/:id', Auth, asyncMiddleware(getUser));
router.post('/:id/cart', Auth, asyncMiddleware(updateCart));
router.get('/:id/cart', Auth, asyncMiddleware(getCart));

module.exports = router;