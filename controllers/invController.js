const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

//Build inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    links,
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
  let links = utilities.getAccountLinks()
  const vehicle = `${data[0].inv_year} ${data[0].inv_model} ${data[0].inv_make}`
  res.render("./inventory/detail", {
    title: vehicle,
    links,
    nav,
    content,
    errors: null,
  })
}

// Build management view
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    links,
    nav,
    errors: null,
    classificationList: classificationSelect,
  })
}

// Build add classification view
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    links,
    nav,
    errors: null,
  })
}

// Process adding the new classification name
invCont.processNewClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const result = await invModel.addNewClassification(classification_name)

  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()

  if (result) {
    req.flash(
      "notice",
      `Congratulations, '${classification_name}' has been added.`
    )
    res.render("./inventory/management", {
      title: "Vehicle Management",
      links,
      nav,
      errors: null,
    })
  } else {
    req.flash(
      "notice", 
      `Sorry, '${classification_name}' could not be added.`)
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      links,
      nav,
      errors: null,
    })
    
  }
}

// Build add inventory view
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()
  let classList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    links,
    nav,
    errors: null,
    classificationList: classList
  })
}

// Process adding the new vehicle
invCont.processNewVehicle = async function (req, res, next) {
  const { classification_id, 
    inv_make, 
    inv_model, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color } = req.body

  const result = await invModel.addNewVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)

  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()

  if (result) {
    req.flash(
      "notice",
      `Congratulations, '${inv_year} ${inv_make} ${inv_model}' has been added.`
    )
    let classList = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      links,
      nav,
      errors: null,
      classificationList: classList
    })
  } else {
    req.flash(
      "notice", 
      `Sorry, '${inv_year} ${inv_make} ${inv_model}' could not be added.`)
      let classList = await utilities.buildClassificationList()
      res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        links,
        nav,
        errors: null,
        classificationList: classList
      })
  }
}

// Return Inventory by Classification As JSON
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

// Build edit inventory view
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()
  let data = await invModel.getItemByInvId(inv_id)
  const itemData = data[0]
  let classList = await utilities.buildClassificationList()
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    links,
    nav,
    errors: null,
    classificationList: classList,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

// Process updating vehicle data
invCont.updateVehicle = async function (req, res, next) {
  const { classification_id, 
    inv_make, 
    inv_model, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_year, 
    inv_miles, 
    inv_color,
    inv_id } = req.body

  const result = await invModel.updateVehicle(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id)

  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()

  if (result) {
    const itemName = inv_make + " " + inv_model
    req.flash(
      "notice", 
      `The ${itemName} was successfully updated.`
    )
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash(
      "notice", 
      "Sorry, the update failed."
    )
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    links,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    inv_id
    })
  }
}

// Build delete inventory view
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()
  let data = await invModel.getItemByInvId(inv_id)
  const itemData = data[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    links,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

// Process deleting vehicle data
invCont.deleteVehicle = async function (req, res, next) {
  let { inv_id,
    inv_make,
    inv_model
   } = req.body
  inv_id = parseInt(inv_id)


  const result = await invModel.deleteVehicle(inv_id)

  let nav = await utilities.getNav()
  let links = utilities.getAccountLinks()

  if (result) {
    const itemName = inv_make + " " + inv_model
    req.flash(
      "notice", 
      `The ${itemName} was successfully deleted.`
    )
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash(
      "notice", 
      "Sorry, the delete failed."
    )
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    links,
    nav,
    errors: null,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    inv_id
    })
  }
}

module.exports = invCont