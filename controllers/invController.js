const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {} // Usamos invCont como nombre base

/* ****************************************
 * FUNCIONES EXISTENTES (Categoría y Detalle)
 * *************************************** */
invCont.buildByClassificationId = async function (req, res, next) {
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

/* ****************************************
 * Entregar vista de Gestión de Inventario
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Entregar vista de Añadir Clasificación (GET)
 * *************************************** */
// Cambiado de invController a invCont
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
 * Procesar Añadir Clasificación (POST)
 * *************************************** */
// Cambiado de invController a invCont
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const classificationResult = await invModel.addClassification(classification_name)

  if (classificationResult) {
    let nav = await utilities.getNav() 
    req.flash("notice", `The ${classification_name} classification was successfully added.`)
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    let nav = await utilities.getNav()
    req.flash("notice", "Sorry, adding the classification failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 * Entregar vista de Añadir Vehículo (GET)
 * *************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  // Aquí llamamos a la función de utilities para crear el <select>
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationSelect, // Pasamos el select a la vista
    errors: null,
  })
}

/* ****************************************
 * Procesar Añadir Vehículo (POST)
 * *************************************** */
invCont.addClassificationInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  } = req.body

  const regResult = await invModel.registerVehicle(
    inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles,
    inv_color, classification_id
  )

  if (regResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, adding the vehicle failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      errors: null,
    })
  }
}

module.exports = invCont