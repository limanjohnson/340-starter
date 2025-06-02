const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const accValidate = require('../utilities/account-validation')

router.get('/login', accountController.buildLogin);
router.get('/register', accountController.buildRegistration);

/*
 * Register a new user
 */
router.post('/register',
    accValidate.registrationRules(),
    accValidate.checkRegData,
    accountController.registerAccount);

// Process the login attempt
router.post(
    '/login',
    accValidate.loginRules(),
    accValidate.checkLoginData,
    accountController.processLogin,
    (req, res) => {
        res.status(200).send('login process')
    }
)

module.exports = router;