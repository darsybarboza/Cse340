const express = require('express');
const baseController = require('../controllers/baseController');
const Util = require('../utilities');
const router = express.Router();

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));

// Error Route
router.get("/stinky", baseController.produceError)

// Logout Route
router.get("/logout", Util.handleErrors(baseController.logout))

module.exports = router;
