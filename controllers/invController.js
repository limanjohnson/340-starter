const invModel = require('../models/inventory-model');
const utilities = require('../utilities');

const invCont = {}

/* ********************
 * Build inventory by classification view
 * ******************* */
invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = req.params.classificationId
        const data = await invModel.getInventoryByClassificationId(classification_id)
        if (!data || data.length === 0) {
            throw new Error(`No vehicles found for that classification ID`)
        }
        const grid = await utilities.buildClassificationGrid(data)
        let nav = await utilities.getNav()
        const className = data[0]?.classification_name
    res.render('./inventory/classification', {
        title: className + " vehicles",
        nav,
        grid, 
        })
    } catch (error) {
        console.error("error in buildByClassificationId: " + error.message)
        next(error)
    }
}

/* ********************
 * Build inventory by id
 * ******************* */

invCont.buildByInventoryId = async function (req, res, next) {
    try {
        const inventory_id = req.params.inventory_id
        const data = await invModel.getInventoryById(inventory_id)
        if (!data) {
            throw new Error(`No vehicle found for that inventory ID`)
        }
        const singlePage = await utilities.buildDetailPage([data])
        let nav = await utilities.getNav()
        const className = data.inv_model
        res.render('./inventory/details', {
            title: data.inv_make + " " + className,
            nav,
            singlePage,
        })
    } catch (error) {
        console.error("Error in buildByInventoryId: " + error.message)
        next(error)
    }
}

/* ********************
 * Build management view
 * ******************* */
invCont.buildManagement = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render('./inventory/management', {
            title: "Management",
            nav,
            errors: null,
        })
    } catch (error) {
        console.error("Error in buildManagement: " + error.message)
        next(error)
    }
}

/* ********************
 * Build add classification view
 * ******************* */
invCont.buildAddClassification = async function (req, res, next) {
    try {
        let nav = await utilities.getNav()
        res.render('./inventory/add-classification', {
            title: "Add Classification",
            nav,
            errors: null,
        })
    } catch (error) {
        console.error("Error in buildAddClassification: " + error.message)
        next(error)
    }
}

/* ********************
 * Add classification view
 * ******************* */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body
    try {
        const result = await invModel.addClassification(classification_name)
        if (result) {
            req.flash("notice", "Classification added successfully")
            res.redirect("/inv");
        } else {
            req.flash("notice", "Error adding classification")
            res.status(500).render("./inventory/add-classification", {
                title: "Add Classification",
                nav: await utilities.getNav(),
                errors: null,
            });
        }
    } catch (error) {
        console.error("Error in addClassification: " + error.message)
        next(error)
    }
}

/* ********************
 * Build add inventory view
 * ******************* */
invCont.buildAddInventory = async function (req, res, next) {
    try {
        let nav = await utilities.getNav();
        let classifications = await invModel.getClassification();
        let classificationList = await utilities.buildClassificationList();
        res.render('./inventory/add-inventory', {
            title: "Add Car",
            nav,
            classificationList,
            errors: null,
        });
    } catch (error) {
        console.error("Error in buildAddInventory: " + error.message);
        next(error);
    }
}

/* ********************
 * Add inventory
 * ******************* */
invCont.addInventory = async function (req, res, next) {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;
    try {
        const result = await invModel.addInventory({ inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id });
        if (result) {
            req.flash("notice", "Inventory item added successfully.");
            res.redirect("/inv");
        } else {
            req.flash("notice", "Error adding inventory item.");
            res.status(500).render('./inventory/add-inventory', {
                title: "Add Car",
                nav: await utilities.getNav(),
                classificationList: await utilities.buildClassificationList(),
                errors: null,
            });
        }
    } catch (error) {
        console.error("Error in addInventory: " + error.message);
        next(error);
    }
}

invCont

module.exports = invCont;