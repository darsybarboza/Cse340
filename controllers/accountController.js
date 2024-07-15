const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    let links = utilities.getAccountLinks()
    res.render("./account/login", {
      title: "Login",
      links,
      nav,
      errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()
  const { account_firstname, 
    account_lastname, 
    account_email, 
    account_password 
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    res.status(500).render("account/register", {
      title: "Register",
      links,
      nav,
      errors: null
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}! Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      links,
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/registration", {
      title: "Register",
      links,
      nav,
    })
  }
}

/* ****************************************
*  Deliver registration view
* *************************************** */  
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()
    res.render("./account/registration", {
      title: "Register",
      links,
      nav,
      errors: null,
    })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    links,
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if (process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
*  Deliver management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()
  let content = utilities.buildAccountManagementView()
    res.render("./account/management", {
      title: "Account Management",
      links,
      nav,
      content,
      errors: null,
  })
}

/* ****************************************
*  Deliver update view
* *************************************** */
async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()
  let account_data = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    res.render("./account/update", {
      title: "Account Management",
      links,
      nav,
      errors: null,
      account_firstname: account_data.account_firstname,
      account_lastname: account_data.account_lastname,
      account_email: account_data.account_email,
      account_id: account_data.account_id
  })
}

/* ****************************************
*  Process updating the account
* *************************************** */
async function updateAccount(req, res, next) {
  const { account_firstname,
          account_lastname,
          account_email,
          account_id
        } = req.body

  const result = await accountModel.updateAccount(account_firstname,
                                                  account_lastname,
                                                  account_email,
                                                  account_id)

  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()

  if (result) {
    req.flash(
      "notice", 
      `Congratulations, your information has been udpated.`
    )
    res.redirect("/account/")
  } else {
    req.flash(
      "notice", 
      "Sorry, the update failed."
    )
    res.status(501).render("account/update", {
    title: "Manage Account",
    links,
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }
}

/* ****************************************
*  Process changing the password
* *************************************** */
async function changePassword(req, res, next) {
  const { account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    res.status(500).render("account/register", {
      title: "Register",
      links,
      nav,
      errors: null
    })
  }

  const result = await accountModel.changePassword(hashedPassword, account_id)

  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()

  if (result) {
    req.flash(
      "notice", 
      `Congratulations, your password has been changed.`
    )
    res.redirect("/account/")
  } else {
    req.flash(
      "notice", 
      "Sorry, the password change failed."
    )
    res.status(501).render("account/update", {
    title: "Manage Account",
    links,
    nav,
    errors: null,
    account_id
    })
  }
}


module.exports = { buildLogin, registerAccount, buildRegistration, accountLogin, buildManagement, buildUpdate, updateAccount, changePassword }