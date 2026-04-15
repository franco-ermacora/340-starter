const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const reviewRoute = require("./routes/reviewRoute") // IMPORTANTE
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

app.use(session({
  store: new (require('connect-pg-simple')(session))({ createTableIfMissing: true, pool }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(cookieParser())
app.use(utilities.checkJWTToken)
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

app.use(static)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use("/review", reviewRoute) // RUTA REGISTRADA

app.get("/", async (req, res) => {
  let nav = await utilities.getNav()
  res.render("index", { title: "Home", nav })
})

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

const port = process.env.PORT || 5500
app.listen(port, () => { console.log(`Servidor en http://localhost:${port}`) })