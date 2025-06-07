const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const accValidate = require('../utilities/account-validation')
const utilities = require('../utilities');

router.get('/login', accountController.buildLogin);
router.get('/register', accountController.buildRegistration);

// Default account management view
router.get('/',
    utilities.checkLogin,
    utilities.checkJWTToken,
    accountController.buildAccountManagement
)

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
    // accountController.processLogin,
    utilities.handleErrors(accountController.accountLogin),
)



module.exports = router;