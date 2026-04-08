const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/") 
const regValidate = require("../utilities/inventory-validation")

// Rutas de visualización pública (Cualquiera puede ver)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId))
router.get("/error", utilities.handleErrors(invController.triggerError))

// --- RUTAS PROTEGIDAS (Solo Employee o Admin) ---

// Gestión de inventario
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.buildManagement))

// AJAX
router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.handleErrors(invController.getInventoryJSON))

// Clasificación
router.get("/addClassification", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClassification))
router.post("/addClassification", utilities.checkAccountType, utilities.handleErrors(invController.addClassification))

// Vehículos
router.get("/addVehicle", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInventory))
router.post("/addVehicle", utilities.checkAccountType, regValidate.vehicleRules(), regValidate.checkVehicleData, utilities.handleErrors(invController.addClassificationInventory))

// Editar
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.editInventoryView))
router.post("/update", utilities.checkAccountType, regValidate.vehicleRules(), regValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory))

// Eliminar
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.handleErrors(invController.deleteView))
router.post("/delete", utilities.checkAccountType, utilities.handleErrors(invController.deleteItem))

module.exports = router