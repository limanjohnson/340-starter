const express = require('express');
const router = new express.Router();
const errorController = require('../controllers/errorController')
const utilities = require('../utilities')


router.get('/intentional-error', utilities.handleErrors(errorController.intentionalError));

module.exports = router;