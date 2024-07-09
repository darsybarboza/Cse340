const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav, errors: null})
}

baseController.produceError = async function(req, res) {
    res.render("idex", {title: "Err", errors: null,})
}

module.exports = baseController