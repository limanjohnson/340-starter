const utilities = require('../utilities')
const errorController = {}

errorController.intentionalError = function (req, res, next) {
    try {
        throw new Error("Intentional 500 error for testing")
    } catch (error) {
        error.status=500
        next(error);
    }
};

module.exports = errorController;