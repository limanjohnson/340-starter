const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const accValidate = require('../utilities/account-validation')
const utilities = require('../utilities');

// Public routes
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

// Update account information
router.get('/update/:account_id',
    utilities.checkLogin,
    utilities.checkJWTToken,
    accountController.buildUpdateAccountView
);
router.post('/update',
    utilities.checkLogin,
    accValidate.updateAccountRules(),
    accValidate.checkUpdateData,
    accountController.updateAccount
)

// Update password
router.post('/update-password',
    utilities.checkLogin,
    accValidate.passwordRules(),
    accValidate.checkPasswordData,
    accountController.updatePassword
)

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('jwt'); // Clear the JWT cookie
    req.flash('notice', 'You have been logged out.');
    res.redirect('/account/login'); // Redirect to login page
})

module.exports = router;