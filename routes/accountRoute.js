// Necessary Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const formValidate = require("../utilities/account-validation")

// Route to login
router.get("/login", accountController.buildLogin)

// Route to registration
router.get("/registration", accountController.buildRegistration)

router.post(
    "/registration", 
    formValidate.registrationRules(),
    formValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

router.post(
  "/login",
   formValidate.loginRules(),
   formValidate.checkLoginData,
   (req, res) => {
     res.status(200).send('login process')
   },
)

module.exports = router