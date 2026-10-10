const express = require('express');
const router = express.Router();

const controller = require('../controllers/professional');

router.get('/', /* #swagger.ignore = true */ controller.getProfessional);

module.exports = router;
