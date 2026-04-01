const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/") 
const regValidate = require("../utilities/inventory-validation") // Importamos el validador

// category route
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// detail route
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))

// error trigger route
router.get("/error", utilities.handleErrors(invController.triggerError))

/* ****************************************
 * Ruta para la administración del inventario
 * *************************************** */
router.get("/", utilities.handleErrors(invController.buildManagement))

// RUTAS PARA CLASIFICACIÓN
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))
router.post("/addClassification", utilities.handleErrors(invController.addClassification))

// RUTAS PARA VEHÍCULOS
router.get("/addVehicle", utilities.handleErrors(invController.buildAddInventory))

// REEMPLAZAMOS LA RUTA ANTERIOR POR ESTA (CON VALIDACIONES):
router.post(
  "/addVehicle",
  regValidate.vehicleRules(), 
  regValidate.checkVehicleData, 
  utilities.handleErrors(invController.addClassificationInventory)
)

module.exports = router