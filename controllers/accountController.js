const utilities = require('../utilities/index');

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
        })
    } catch (error) {
        console.error("error in buildLogin: " + error.message)
        next(error)
    }
    
}

module.exports = accCont;