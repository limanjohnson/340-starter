const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');

router.get('/login', accountController.buildLogin);

module.exports = router;