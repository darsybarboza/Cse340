const utilities = require(".")
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
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
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
        .escape()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please enter a valid make"),

        // Model is required and must be a string
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please enter a valid model"),
        
        // Image path is required and must be a string
        body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please enter a valid image path"),

        // Thumbnail path is required and must be a string
        body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please enter a valid thumbnail path"),
        
        // Price is required and must be a number
        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isFloat()
        .withMessage("Please enter a valid price"),
        
        // Year is required and must only be four digits long
        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .isLength({ max: 4})
        .withMessage("Please enter a valid year"),
        
        // Miles is required and must be a number
        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please enter a valid mileage"),

        // Color is required and must be a string
        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please enter a valid color"),
    ]
}

// Check the new vehicle data
validate.checkNewVehicleData = async (req, res, next) => {
    const { classification_id, 
        inv_make, inv_model, 
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
        let classList = await utilities.buildClassificationList()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            classificationList: classList,
            classification_id, 
            inv_make, inv_model, 
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

module.exports = validate