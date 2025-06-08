const invModel = require('../models/inventory-model');
const utilities = require('../utilities');

const invCont = {}

/* ********************
 * Build inventory by classification view
 * ******************* */
invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = req.params.classification_id
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
        const classificationSelect = await utilities.buildClassificationList()
        res.render('./inventory/management', {
            title: "Management",
            nav,
            errors: null,
            classificationSelect,
            notice: req.flash("notice"),
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
        let classificationSelect = await utilities.buildClassificationList();
        res.render('./inventory/add-inventory', {
            title: "Add Car",
            nav,
            classificationSelect,
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
    const {
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_price,
        inv_miles,
        inv_color,
        classification_id } = req.body;

        const inv_image = req.body.inv_image || 'images/vehicles/no-image.png';
        const inv_thumbnail = req.body.inv_thumbnail || 'images/vehicles/no-image.png';
    try {
        const result = await invModel.addInventory({
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        });
        if (result) {
            req.flash("notice", "Inventory item added successfully.");
            res.redirect("/inv");
        } else {
            req.flash("notice", "Error adding inventory item.");
            res.status(500).render('./inventory/add-inventory', {
                title: "Add Car",
                nav: await utilities.getNav(),
                classificationSelect: await utilities.buildClassificationList(),
                errors: null,
            });
        }
    } catch (error) {
        console.error("Error in addInventory: " + error.message);
        next(error);
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }

 /* ********************
 * Edit inventory view
 * ******************* */
 invCont.buildEditInventory = async (req, res, next) => {
    try {
        const inv_id = parseInt(req.params.inv_id, 10);
        if (isNaN(inv_id)) {
            console.error("Invalid inv_id:", req.params.inv_id);
            req.flash("notice", "Invalid inventory ID.");
            return res.redirect("/inv/");
        }

        let nav = await utilities.getNav();
        const itemData = await invModel.getInventoryById(inv_id);
        if (!itemData) {
            console.error("No inventory item found for ID:", inv_id);
            req.flash("notice", "No inventory item found.");
            return res.redirect("/inv/");
        }

        let classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
        if (!classificationSelect) {
            classificationSelect = '<select id="classification_id" name="classification_id"><option value="">No classifications available</option></select>';
        }

        const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
        res.render('./inventory/edit-inventory', {
            title: "Edit " + itemName,
            nav,
            classificationSelect,
            errors: null,
            inv_id: itemData.inv_id,
            inv_make: itemData.inv_make,
            inv_model: itemData.inv_model,
            inv_year: itemData.inv_year,
            inv_description: itemData.inv_description,
            inv_image: itemData.inv_image,
            inv_thumbnail: itemData.inv_thumbnail,
            inv_price: itemData.inv_price,
            inv_miles: itemData.inv_miles,
            inv_color: itemData.inv_color,
            classification_id: itemData.classification_id,
        });
    } catch (error) {
        console.error("Error in buildEditInventory:", error.message);
        next(error);
    }
};

/* ********************
 * Update inventory data
 * ******************* */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    const {
        inv_id,
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
    } = req.body;

    try {
        const updateResult = await invModel.updateInventory(
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id // Ensure the order matches the function signature
        );

        if (updateResult) {
            const itemName = updateResult.inv_make + " " + updateResult.inv_model;
            req.flash("notice", `The ${itemName} was successfully updated.`);
            res.redirect("/inv/");
        } else {
            let classificationSelect = await utilities.buildClassificationList(classification_id);
            if (!classificationSelect) {
                classificationSelect = '<select id="classification_id" name="classification_id"><option value="">No classifications available</option></select>';
            }

            const itemName = `${inv_make} ${inv_model}`;
            req.flash("notice", "Sorry, the update failed.");
            res.status(501).render("inventory/edit-inventory", {
                title: "Edit " + itemName,
                nav,
                classificationSelect,
                errors: null,
                inv_id,
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
            });
        }
    } catch (error) {
        console.error("Error in updateInventory:", error.message);
        next(error);
    }
};

 /* ********************
 * Build delete inventory view
 * ******************* */
 invCont.deleteInventoryConfirmation = async (req, res, next) => {
    try {
        const inv_id = parseInt(req.params.inv_id, 10);
        if (isNaN(inv_id)) {
            console.error("Invalid inv_id:", req.params.inv_id);
            req.flash("notice", "Invalid inventory ID.");
            return res.redirect("/inv/");
        }

        let nav = await utilities.getNav();
        const itemData = await invModel.getInventoryById(inv_id);
        if (!itemData) {
            console.error("No inventory item found for ID:", inv_id);
            req.flash("notice", "No inventory item found.");
            return res.redirect("/inv/");
        }

        const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
        res.render('./inventory/delete-confirm', {
            title: "Edit " + itemName,
            nav,
            errors: null,
            inv_id: itemData.inv_id,
            inv_make: itemData.inv_make,
            inv_model: itemData.inv_model,
            inv_year: itemData.inv_year,
            inv_price: itemData.inv_price,
        });
    } catch (error) {
        console.error("Error in deleteInventoryConfirmation:", error.message);
        next(error);
    }
};

/* ********************
 * Delete inventory item
 * ******************* */
invCont.deleteInventoryProcess = async function (req, res, next) {
    let nav = await utilities.getNav();
    const inv_id = parseInt(req.params.inv_id, 10);

    try {
        const deleteResult = await invModel.deleteInventory(inv_id);

        if (deleteResult) {
            req.flash("notice", "The inventory item was successfully deleted.");
            res.redirect("/inv/");
        } else {
            req.flash("notice", "Sorry, the delete failed.");
            res.status(501).render("inventory/delete-confirm", {
                title: "Delete Inventory Item",
                nav,
                errors: null,
                inv_id,
                inv_make: req.body.inv_make,
                inv_model: req.body.inv_model,
                inv_year: req.body.inv_year,
                inv_price: req.body.inv_price,
                notice: "Sorry, the delete failed.",
            })
        }
    } catch (error) {
        console.error("Error in deleteInventoryProcess:", error.message);
        next(error);
    }
};

module.exports = invCont;