const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Ruta para la administración de la cuenta (GET) - PROTEGIDA
router.get("/", 
  utilities.checkLogin, // El guardia: Si no está logueado, lo manda al login
  utilities.handleErrors(accountController.buildManagement) // Tenés que crear esta función en el controlador si no la tenés
)

// Ruta para mostrar Login y Registro (GET)
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Ruta para PROCESAR el registro (POST)
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Ruta para PROCESAR el login (POST) - CORREGIDA
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin) // Ahora usa la función del controlador
)

module.exports = router