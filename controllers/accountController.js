const utilities = require('../utilities/index');
const accModel = require('../models/account-model');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accCont = {}

/* ***************************
 * Deliver login view
 * ************************* */
accCont.buildLogin = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } catch (error) {
        console.error("error in buildLogin: " + error.message)
        next(error)
    }
    
}

/* ***************************
 * Deliver registration view
 * ************************* */
accCont.buildRegistration = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render("account/register", {
            title:"Signup",
            nav,
            errors: null
        })
    } catch (error) {
        console.error("error in buildRegstration: " + error.message)
        next(error)
    }
}

/* ***************************
 * Build account management view
 * ************************* */
accCont.buildAccountManagement = async function (req, res) {
    try {
        let nav = await utilities.getNav();

        const account_id = res.locals.user?.account_id;
        const updatedUser = await accModel.getAccountById(account_id);

        res.render("account/management", {
            title: "Account",
            nav,
            errors: null,
            messages: req.flash("notice"),
            user: updatedUser,
        });
    } catch (error) {
        console.error("error in buildAccountManagement: " + error.message);
        res.status(500).send("Server Error.");
    }
};

/* ****************************************
*  Process Registration
* *************************************** */
accCont.registerAccount = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the registration")
        req.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
        });
    }

    const regResult = await accModel.registerAccount(
        account_firstname, 
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors:[],
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
*  Process Login
* *************************************** */
accCont.processLogin = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_email } = req.body;

    const user = await accModel.checkExistingEmail(account_email)

    if (!user) {
        req.flash("notice", "The email provided does not exist.");
        return res.status(401).render("account/login", {
            title: "Login",
            nav,
            errors: [{ msg: "The email provided does not exist." }],
            account_email,
        })
    } else {
        req.flash("notice", `Welcome back!`);
        res.redirect("/account/")
    }
}

/* ****************************************
*  Process Login Request
* *************************************** */
accCont.accountLogin = async function (req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
            return res.redirect("/account/");
          }
      else {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
        })
      }
    } catch (error) {
      throw new Error('Access Forbidden')
    }
  }

/* ****************************************
*  Build Update Account View
* *************************************** */
accCont.buildUpdateAccountView = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        const account_id = req.params.account_id;
        const accountData = await accModel.getAccountById(account_id);
        if (!accountData) {
            req.flash("notice", "Account not found.");
            return res.status(404).render("/account/");
        }
        res.render("account/update", {
            title: "Update Account",
            nav,
            errors: null,
            accountData
        })
    } catch (error) {
        console.error("error in the buildUpdateAccoutnView: " + error.message);
        next(error);
    }
}

/* ****************************************
*  Process Update Account
* *************************************** */
accCont.updateAccount = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { 
        account_id,
        account_firstname,
        account_lastname,
        account_email,
    } = req.body;

    try {
        const updateAccount = await accModel.updateAccount(
            account_id,
            account_firstname,
            account_lastname,
            account_email,
        );
        if (updateAccount) {
            const updatedUser = await accModel.getAccountById(account_id);
            res.locals.user = updatedUser; // update local user data
            res.session.user = updatedUser; // update session user data

            // Regenerate the JWT token with updated user data
            const accessToken = jwt.sign(updatedUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

            req.flash("notice", "Account information updated successfully.");
            res.redirect("/account/");
        } else {
            req.flash("notice", "Failed to update account information.");
            res.status(500).render("account/update", {
                title: "Update Account Information",
                nav,
                errors: null,
                accountData: {
                    account_id,
                    account_firstname,
                    account_lastname,
                    account_email
                }
            })
        }
    } catch (error) {
        console.error("Error in updateAccount: " + error.message);
        next(error);
    }
}

/* ****************************************
*  Process Password Account
* *************************************** */
accCont.updatePassword = async function (req, res, next) {
    const { account_id, account_password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(account_password, 10);
        const result = await accModel.updatePassword(account_id, hashedPassword);
        if (result) {
            req.flash("notice", "Password updated successfully.");
            res.redirect("/account/");
        } else {
            req.flash("notice", "Failed to update password.");
            res.redirect(`/account/update/${account_id}`);
        }
    } catch (error) {
        console.error("Error in updatePassword: " + error.message);
        next(error);
    }
};

module.exports = accCont;