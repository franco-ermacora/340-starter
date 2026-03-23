const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

// 1. Estáticos
app.use(static)

// 2. IMPORTANTE: La ruta de inventario primero
app.use("/inv", inventoryRoute)

// 3. Ruta Home
app.get("/", async (req, res) => {
  let nav = await utilities.getNav()
  res.render("index", { title: "Home", nav })
})

// 4. Error Handler (Tarea 3)
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