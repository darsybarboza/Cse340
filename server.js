/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const static = require("./routes/static")
const utilities  = require("./utilities/")
const pool = require("./database/")

//Session setup




/* ***********************
/* View Engine and Templates 
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root
/* ***********************
 * Routes
 *************************/
//static Routes
app.use(static)

//Index Routes
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory Routes
app.use("/inv", utilities.handleErrors(inventoryRoute))

//Catch all error routes
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, it appears while searching for vehicles, you have wondered into a different parking lot!'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status == 404 || err.status == 500) { message = err.message} else {message = 'Oh no! There was an issue routing your destination..'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
