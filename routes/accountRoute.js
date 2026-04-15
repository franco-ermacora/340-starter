const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// --- ADMINISTRACIÓN (PROTEGIDA) ---
router.get("/", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildManagement)
)

// --- LOGIN Y REGISTRO ---
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get("/logout", utilities.handleErrors(accountController.accountLogout))
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)


// --- ACTUALIZACIÓN DE CUENTA (Task 5) ---

// 1. Entrega de la vista (GET)
router.get(
  "/update/:account_id", 
  utilities.checkLogin, // Agregado por seguridad
  utilities.handleErrors(accountController.buildAccountUpdate)
)

// 2. Procesar actualización de datos básicos (POST)
router.post(
  "/update-info",
  regValidate.updateAccountRules(), 
  regValidate.checkUpdateData,      
  utilities.handleErrors(accountController.processAccountUpdate)
)

// 3. Procesar actualización de contraseña (POST)
router.post(
  "/update-password",
  // Usamos solo la regla de password del registro (es la posición 3 del array)
  [regValidate.registrationRules()[3]], 
  regValidate.checkUpdateData, 
  utilities.handleErrors(accountController.processPasswordUpdate)
)

// --- LOGOUT (Task 6) ---
router.get("/logout", accountController.accountLogout)

module.exports = router