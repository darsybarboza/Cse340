const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validate = {}


// Make sure the classification name is all alphabetical characters
validate.newClassificationRules = () => {
    return [ body("classification_name")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1})
    .withMessage("Names must be alphabetical characters only.") // on error this message is sent
    ]
}

// Check the classification name
validate.checkClassificationName = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let links = utilities.getAccountLinks()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            links,
            classification_name
        })
        return
    }
    next()
}

// Make sure the vehicle data follows the rules
validate.newVehicleRules = () => {
    return [ 
        // Make is required and must be a string
        body("inv_make")
        .trim()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please enter a valid make"),

        // Model is required and must be a string
        body("inv_model")
        .trim()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please enter a valid model"),
        
        // Image path is required and must be a string
        body("inv_image")
        .trim()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please enter a valid image path"),

        // Thumbnail path is required and must be a string
        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please enter a valid thumbnail path"),
        
        // Price is required and must be a number
        body("inv_price")
        .trim()
        .notEmpty()
        .isFloat()
        .withMessage("Please enter a valid price"),
        
        // Year is required and must only be four digits long
        body("inv_year")
        .trim()
        .notEmpty()
        .isInt()
        .isLength({ max: 4})
        .withMessage("Please enter a valid year"),
        
        // Miles is required and must be a number
        body("inv_year")
        .trim()
        .notEmpty()
        .isInt()
        .withMessage("Please enter a valid mileage"),

        // Color is required and must be a string
        body("inv_color")
        .trim()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please enter a valid color"),
    ]
}

// Check the new vehicle data
validate.checkNewVehicleData = async (req, res, next) => {
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

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let links = utilities.getAccountLinks()
        let classList = await utilities.buildClassificationList()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            links,
            classificationList: classList,
            classification_id, 
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color
        })
        return
    }
    next()
}

// Check the updated vehicle data
validate.checkUpdateData = async (req, res, next) => {
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

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let links = utilities.getAccountLinks()
        let classList = await utilities.buildClassificationList()
        res.render("inventory/edit-inventory", {
            errors,
            title: "Edit " + inv_make + " " + inv_model,
            nav,
            links,
            classificationList: classList,
            classification_id, 
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_year, 
            inv_miles, 
            inv_color,
            inv_id
        })
        return
    }
    next()
}

// Make sure the review_text is at least 10 characters long
validate.newReviewRules = () => {
    return [ body("review_text")
    .trim()
    .notEmpty()
    .isLength({ min: 10})
    .withMessage("Reviews must be at least 10 characters long.") // on error this message is sent
    ]
}

// Check the review data
validate.checkNewReviewData = async (req, res, next) => {
    const { review_text, inv_id } = req.body

    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const car_data = await invModel.getItemByInvId(inv_id)
        const review_data = await invModel.getReviewsByInvId(inv_id)
        const users_data = await invModel.getAccountDataByInvId(inv_id)
        const content = await utilities.buildIndividualView(car_data, review_data, users_data)
        let nav = await utilities.getNav()
        let links = utilities.getAccountLinks()
        const vehicle = `${car_data[0].inv_year} ${car_data[0].inv_model} ${car_data[0].inv_make}`
        res.render("./index", {
            title: vehicle,
            links,
            nav,
            content,
            errors,
            review_text,
            inv_id
          })
        return
    }
    next()
}

module.exports = validate