const utilities = require(".");
const { body, validationResult } = require('express-validator');
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
  *  Classification Data Validation Rules
  * ********************************* */

validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Classification name is required")
        .custom(async (classification_name) => {
            const classificationExists = await invModel.checkExistingClassification(classification_name)
            if (classificationExists) {
                throw new Error("Classification already exists. Enter a new classification")
            }
        }),
    ]
}

/*  **********************************
  *  Inventory Data Validation Rules
  * ********************************* */
validate.inventoryRules = () => {
    return [
        body("inv_model")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Model of car is required")
          .isLength({ min:3 })
          .withMessage( "Model name must be at least 3 characters long."),
        
        // inv_make is required and must be a sting
        body("inv_make")
          .trim()
          .escape()
          .notEmpty()
          .isLength({ min:2 })
          .withMessage( "Make of car is required" ),

        body("inv_year")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Vehicle Year is required")
          .isInt({ min: 1886 })
          .withMessage("Year must be a valid number"),

        body("inv_description")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Description is required"),

        body("inv_image")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("An image is required"),

        body("inv_thumbnail")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("A thumbnail is required"),

        body("inv_price")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Vehicle price is required"),

        body("inv_miles")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Vehicle's miles are required"),

        body("inv_color")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Vehicle color is required"),

        body("classification_id")
          .trim()
          .escape()
          .notEmpty()
          .withMessage("Vehicle classification is required"),
    ]
}

/* ******************************
 * Check classification data and return errors or continue to login
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors:errors.array(),
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

/* ******************************
 * Check inventory data and return errors or continue to login
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors: errors.array(),
            title: "Add Car",
            nav,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
        })
        return
    }
    next()
}


module.exports = validate;