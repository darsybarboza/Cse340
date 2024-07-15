const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    let links = utilities.getAccountLinks()
    res.render("index", {title: "Home", links, nav, errors: null})
}

baseController.produceError = async function(req, res) {
    const nav = await utilities.getNav()
    let links = utilities.getAccountLinks()
    res.render("idex", {title: "Err", nav, links, errors: null,})
}

baseController.logout = async function(req, res) {
    res.clearCookie("jwt")
    const nav = await utilities.getNav()
    let links = utilities.getAccountLinks()
    res.render(
        "index", {
        title: "Home", 
        links, 
        nav, 
        errors: null
    })
}

module.exports = baseController
