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

module.exports = invCont;