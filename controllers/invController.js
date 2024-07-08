const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

//Build inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

// Build individual view by inv_id
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getItemByInvId(inv_id)
  const content = await utilities.buildIndividualView(data)
  let nav = await utilities.getNav()
  const vehicle = `${data[0].inv_year} ${data[0].inv_model} ${data[0].inv_make}`
  res.render("./inventory/detail", {
    title: vehicle,
    nav,
    content,
    errors: null,
  })
}




module.exports = invCont