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

// Build management view
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

// Build add classification view
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

// Process adding the new classification name
invCont.processNewClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const result = await invModel.addNewClassification(classification_name)

  let nav = await utilities.getNav()

  if (result) {
    req.flash(
      "notice",
      `Congratulations, '${classification_name}' has been added.`
    )
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash(
      "notice", 
      `Sorry, '${classification_name}' could not be added.`)
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
    
  }
}

// Build add inventory view
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    classificationList: classList
  })
}

// Process adding the new vehicle
invCont.processNewVehicle = async function (req, res, next) {
  const { classification_id, 
    inv_make, inv_model, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color } = req.body

  const result = await invModel.addNewVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)

  let nav = await utilities.getNav()

  if (result) {
    req.flash(
      "notice",
      `Congratulations, '${inv_year} ${inv_make} ${inv_model}' has been added.`
    )
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    req.flash(
      "notice", 
      `Sorry, '${inv_year} ${inv_make} ${inv_model}' could not be added.`)
      let classList = await utilities.buildClassificationList()
      res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        errors: null,
        classificationList: classList
      })
  }
}

module.exports = invCont