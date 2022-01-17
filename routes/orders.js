
const app = require('express');
const Auth = require('../middlewares/Auth');
const asyncMiddleware = require('../middlewares/async');
const {
  createOrder,
  editOrder,
  getOrders
} = require('../controllers/orders');
const router = app.Router();

router.post('/create', Auth, asyncMiddleware(createOrder))
router.post('/all', Auth, asyncMiddleware(getOrders))
router.post('/:orderId', Auth, asyncMiddleware(editOrder))

module.exports = router;