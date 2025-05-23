const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController')


router.get('/type/:classificationId', invController.buildByClassificationId);

router.get('/detail/:inventory_id', invController.buildByInventoryId);

module.exports = router;