const express = require('express');
const router = express.Router();

const controller = require('../controllers');

// "#swagger.ignore = true" leaves a route out of swagger.json,
// so the API docs only list the /contacts routes.
router.get('/', /* #swagger.ignore = true */ controller.home);
router.use('/professional', require('./professional'));
router.use('/contacts', require('./contacts'));
router.use('/api-docs', require('./swagger'));

module.exports = router;
