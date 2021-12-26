const Auth = require('../middlewares/Auth');
const asyncMiddleware = require('../middlewares/async');
const express = require('express');
const { editUser, getUser } = require('../controllers/user');

const router = express.Router();

router.post('/:id', Auth, asyncMiddleware(editUser));
router.get('/:id', Auth, asyncMiddleware(getUser));


module.exports = router;