// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const formValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build individual vehicle view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to build management view
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagementView));

// Route to add classification view
router.get("/add-classification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification))

// Route to add inventory view
router.get("/add-inventory", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))

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

// Inventory management
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Edit inventory
router.get("/edit/:invId", utilities.handleErrors(invController.editInventoryView))

// On vehicle edited
router.post(
    "/update/",
    formValidate.newVehicleRules(),
    formValidate.checkNewVehicleData,
    utilities.handleErrors(invController.updateVehicle)
)

// Delete inventory
router.get("/delete/:invId", utilities.handleErrors(invController.deleteInventoryView))

// On vehicle deleted
router.post(
    "/delete",
    utilities.handleErrors(invController.deleteVehicle)
)

module.exports = router;