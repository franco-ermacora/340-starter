const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// category route
router.get("/type/:classificationId", invController.buildByClassificationId)

// detail route
router.get("/detail/:invId", invController.buildByInvId)

// error trigger route
router.get("/error", invController.triggerError)

module.exports = router