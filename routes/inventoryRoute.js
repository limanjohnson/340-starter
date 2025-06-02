const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController')
const invValidate = require('../utilities/inventory-validation')


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

module.exports = router;