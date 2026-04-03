const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser") // Importar cookie-parser

/* ***********************
 * Middleware de Sesión y Mensajes
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Middleware de Cookies y JWT
app.use(cookieParser()) // Para que el servidor lea las cookies
app.use(utilities.checkJWTToken) // Para que verifique si el usuario está logueado en cada click

// Middleware para que los mensajes flash funcionen
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Body Parser para leer datos de los formularios
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Rutas
 * ************************/
app.use(static)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

// Ruta Home
app.get("/", async (req, res) => {
  let nav = await utilities.getNav()
  res.render("index", { title: "Home", nav })
})

/* ***********************
 * Error Handler
 * ************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

const port = process.env.PORT || 5500
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})