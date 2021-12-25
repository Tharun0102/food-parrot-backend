const { application } = require('express');
const express = require('express');
const { editUser, getUser } = require('../controllers/user');

const router = express.Router();

router.post('/:id', editUser);
router.get('/:id', getUser);


module.exports = router;