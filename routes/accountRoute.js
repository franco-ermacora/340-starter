const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController") // Usaremos este nombre
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Administración (PROTEGIDA)
router.get("/", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildManagement)
)

// Login y Registro
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))

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
// Entrega de la vista
router.get("/update/:account_id", utilities.handleErrors(accountController.buildAccountUpdate))

// Proceso de Info (Fijate que cambié accountCont por accountController)
router.post(
  "/update-info", 
  regValidate.updateAccountRules ? regValidate.updateAccountRules() : [], // Solo si tenés las reglas
  utilities.handleErrors(accountController.processAccountUpdate)
)

// Proceso de Password
router.post(
  "/update-password", 
  regValidate.passwordRules ? regValidate.passwordRules() : [], 
  utilities.handleErrors(accountController.processPasswordUpdate)
)

// Logout
router.get("/logout", accountController.accountLogout)

module.exports = router