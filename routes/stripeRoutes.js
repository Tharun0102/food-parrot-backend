const app = require('express');
const { createCheckoutSession, retrieveSession, expireSession } = require('../controllers/stripePayment');
const asyncMiddleware = require('../middlewares/async');
const router = app.Router();

router.post("/create-checkout-session", asyncMiddleware(createCheckoutSession))
router.post("/retrieve-session", asyncMiddleware(retrieveSession))
router.post("/expire-session", asyncMiddleware(expireSession))

module.exports = router;