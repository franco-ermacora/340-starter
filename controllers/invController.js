const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

invCont.buildByClassificationId = async function (req, res, next) {
  console.log("-----------------------------------------")
  console.log("!!! FUNCIÓN DE CATEGORÍA ACTIVADA !!!")
  console.log("-----------------------------------------")
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0] ? data[0].classification_name : "Vehicles"
    res.render("./inventory/classification", { title: className, nav, grid })
  } catch (error) {
    next(error)
  }
}

invCont.buildByInvId = async function (req, res, next) {
  console.log("!!! FUNCIÓN DE DETALLE ACTIVADA !!!")
  try {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryById(inv_id)
    const grid = await utilities.buildVehicleDisplay(data)
    let nav = await utilities.getNav()
    res.render("./inventory/detail", { title: data.inv_make + " " + data.inv_model, nav, grid })
  } catch (error) {
    next(error)
  }
}

invCont.triggerError = async function (req, res, next) {
  const error = new Error("Oh no! You triggered an intentional error.")
  error.status = 500
  next(error)
}

module.exports = invCont