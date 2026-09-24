const express = require('express');
const router = express.Router();

const controller = require('../controllers/professional');

router.get('/', controller.getProfessional);

module.exports = router;
