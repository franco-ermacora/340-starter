const express = require("express")
const router = new express.Router()
const revController = require("../controllers/reviewController")
const utilities = require("../utilities/")

// Ruta para procesar la nueva reseña
router.post("/add", utilities.handleErrors(revController.addReview))

module.exports = router