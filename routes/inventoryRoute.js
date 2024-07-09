// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const formValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build individual vehicle view
router.get("/detail/:invId", invController.buildByInvId);

// Route to build management view
router.get("/", invController.buildManagementView);

// Route to add classification view
router.get("/add-classification", invController.buildAddClassification)

// Route to add inventory view
router.get("/add-inventory", invController.buildAddInventory)

// On new classification view submitted
router.post(
    "/add-classification",
    formValidate.newClassificationRules(),
    formValidate.checkClassificationName,
    utilities.handleErrors(invController.processNewClassification)
)

// On new vehicle added
router.post(
    "/add-inventory",
    formValidate.newVehicleRules(),
    formValidate.checkNewVehicleData,
    utilities.handleErrors(invController.processNewVehicle)
)

module.exports = router;