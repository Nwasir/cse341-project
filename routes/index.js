const express = require('express');
const router = express.Router();

const controller = require('../controllers');

router.get('/', controller.home);
router.use('/professional', require('./professional'));
router.use('/contacts', require('./contacts'));

module.exports = router;
