const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

/* ****************************************
* Entregar vista de Login
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null, // Agregamos esto por seguridad
  })
}

/* ****************************************
* Entregar vista de Registro
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
* PROCESAR REGISTRO (POST)
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { 
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password 
  } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null, // Siempre pasar errors: null si todo salió bien
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null, // Agregamos esto para que la vista no explote
      // Esto devuelve los datos al formulario (Stickiness)
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

module.exports = { buildLogin, buildRegister, registerAccount }