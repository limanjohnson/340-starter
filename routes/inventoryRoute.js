const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController')
const invValidate = require('../utilities/inventory-validation')
const utilities = require('../utilities');

router.get('/type/:classificationId', invController.buildByClassificationId);
router.get('/detail/:inventory_id', invController.buildByInventoryId);
router.get('/', invController.buildManagement);

/*
 * Add a new classiifcation
 * */
router.get('/add-classification', invController.buildAddClassification);
router.post('/add-classification',
    invValidate.classificationRules(),
    invValidate.checkClassData,
    invController.addClassification);

/*
 * Add a new car to inventory
 * */
router.get('/add-inventory', invController.buildAddInventory);
router.post('/add-inventory',
    invValidate.inventoryRules(),
    invValidate.checkInvData,
    invController.addInventory);

router.get('/getInventory/:classification_id',
    utilities.handleErrors(invController.getInventoryJSON));

/*
 * Edit a car in inventory
 * */
router.get('/edit/:inventory_id', utilities.handleErrors(invController.buildEditInventory));

module.exports = router;