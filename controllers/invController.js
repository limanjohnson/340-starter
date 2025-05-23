const invModel = require('../models/inventory-model');
const utilities = require('../utilities');

const invCont = {}

/* ********************
 * Build inventory by classification view
 * ******************* */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render('./inventory/classification', {
        title: className + " vehicles",
        nav,
        grid,
    })
}

invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventory_id
    const data = await invModel.getInventoryById(inventory_id)
    const singlePage = await utilities.buildDetailPage([data])
    let nav = await utilities.getNav()
    const className = data.inv_model
    res.render('./inventory/details', {
        title: data.inv_make + " " + className,
        nav,
        singlePage,
    })
}

module.exports = invCont;