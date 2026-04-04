const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/") 
const regValidate = require("../utilities/inventory-validation")

// Rutas de visualización pública
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))
router.get("/error", utilities.handleErrors(invController.triggerError))

// Ruta principal de administración
router.get("/", utilities.handleErrors(invController.buildManagement))

// AJAX: Obtener lista de vehículos para la tabla
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Rutas para Clasificación
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification))
router.post("/addClassification", utilities.handleErrors(invController.addClassification))

// Rutas para Añadir Vehículos
router.get("/addVehicle", utilities.handleErrors(invController.buildAddInventory))
router.post("/addVehicle", regValidate.vehicleRules(), regValidate.checkVehicleData, utilities.handleErrors(invController.addClassificationInventory))

// Rutas para EDITAR Vehículos (NUEVO)
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))

// Ruta para PROCESAR la actualización
router.post(
  "/update", 
  regValidate.vehicleRules(), // Reutilizamos las reglas de validación
  regValidate.checkUpdateData, // Middleware específico para Update (deberás crearlo en validation.js)
  utilities.handleErrors(invController.updateInventory)
)

// Ruta para mostrar la confirmación de eliminación 
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteView))

// Ruta para procesar la eliminación 
router.post("/delete", utilities.handleErrors(invController.deleteItem))

module.exports = router