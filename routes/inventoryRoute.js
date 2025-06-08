const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController')
const invValidate = require('../utilities/inventory-validation')
const utilities = require('../utilities');

// Public routes
router.get('/type/:classification_id', invController.buildByClassificationId);
router.get('/detail/:inventory_id', invController.buildByInventoryId);


/*
 * Add a new classiifcation
 * */
router.get('/', utilities.checkAdminOrEmployee, invController.buildManagement);
router.get('/add-classification', utilities.checkAdminOrEmployee, invController.buildAddClassification);
router.post('/add-classification',
    utilities.checkAdminOrEmployee,
    invValidate.classificationRules(),
    invValidate.checkClassData,
    invController.addClassification);
/*
 * Add a new car to inventory
 * */
router.get('/add-inventory', utilities.checkAdminOrEmployee, invController.buildAddInventory);
router.post('/add-inventory',
    utilities.checkAdminOrEmployee,
    invValidate.inventoryRules(),
    invValidate.checkInvData,
    invController.addInventory);

router.get('/getInventory/:classification_id',
    utilities.checkAdminOrEmployee,
    utilities.handleErrors(invController.getInventoryJSON));

/*
 * Edit a car in inventory
 * */
router.get('/edit/:inv_id', utilities.checkAdminOrEmployee, utilities.handleErrors(invController.buildEditInventory));

/*
 * Update a car in inventory
 * */
router.post('/update/', 
    utilities.checkAdminOrEmployee,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

// Delete a car from inventory
router.get('/delete', (req, res) => {
    res.redirect('/inv/');
});
router.get('/delete/:inv_id', utilities.checkAdminOrEmployee, utilities.handleErrors(invController.deleteInventoryConfirmation));
router.post('/delete/:inv_id', utilities.checkAdminOrEmployee, utilities.handleErrors(invController.deleteInventoryProcess));

module.exports = router;