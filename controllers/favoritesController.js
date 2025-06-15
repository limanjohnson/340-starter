const favoritesModel = require('../models/favorite-model');
const favoritesController = {};
const utilities = require('../utilities')

/* ***************************
 * Add a favorite
 * ************************* */
favoritesController.addFavorite = async function (req, res, next) {
    const { inventory_id } = req.body;
    const account_id = res.locals.user.account_id;

    try {
        const favorite = await favoritesModel.addFavorite(account_id, inventory_id)
        req.flash("notice", "Vehicles added to favorites!");
        res.redirect("/account/favorites");
    } catch (error) {
        console.error("Error in addFavorite: " + error.message);
        next(error);
    }
};

/* ***************************
 * Display favorites
 * ************************* */
favoritesController.getFavorites = async function (req, res, next) {
    const account_id = res.locals.user.account_id;

    try {
        const favorites = await favoritesModel.getFavoritesByAccountId(account_id);
        res.render("account/favorites", {
            title: "My Favorites",
            nav: await utilities.getNav(),
            favorites,
        });
    } catch (error) {
        console.error("Error in getFavorites: " + error.message);
        next(error);
    }
};

/* ***************************
 * Remove a favorite
 * ************************* */
favoritesController.removeFavorite = async function (req, res, next) {
    const { favorite_id } = req.body;

    try {
        const result = await favoritesModel.removeFavorite(favorite_id);
        if (result) {
            req.flash("notice", "Favorite removed successfully!");
        } else {
            req.flash("notice", "Failed to remove favorite.");
        }
        res.redirect("/account/favorites");
    } catch (error) {
        console.error("Error in removeFavorite: " + error.message);
        next(error);
    }
};

module.exports = favoritesController;