// Necessary Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const formValidate = require("../utilities/account-validation")

// Management route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

// Route to login
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to registration
router.get("/registration", utilities.handleErrors(accountController.buildRegistration))

// Route to update information
router.get("/update", utilities.handleErrors(accountController.buildUpdate))

// Registration Process
router.post(
    "/registration", 
    formValidate.registrationRules(),
    formValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Login Process
router.post(
  "/login",
   formValidate.loginRules(),
   formValidate.checkLoginData,
   utilities.handleErrors(accountController.accountLogin)
)

// Update Information Process
router.post(
  "/update-info", 
  formValidate.updateRules(),
  formValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Update Password Process
router.post(
  "/change-password",
  formValidate.changePasswordRules(),
  formValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
)

module.exports = router