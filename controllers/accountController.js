const utilities = require('../utilities/index');
const accModel = require('../models/account-model');
const bcrypt = require("bcryptjs")

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
        res.redirect("/account/login")
    }
}

module.exports = accCont;