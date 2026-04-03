const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 * Reglas de validación para Vehículos
 * ********************************* */
validate.vehicleRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid make (min 3 characters)."),

    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a valid model (min 3 characters)."),

    body("inv_price")
      .trim()
      .isNumeric()
      .withMessage("Price must be a number."),

    body("inv_miles")
      .trim()
      .isNumeric()
      .withMessage("Miles must be digits only."),
  ]
}

/* ******************************
 * Chequear datos y volver con errores si existen
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    })
    return
  }
  next()
}

/* ******************************
 * Check Update Data and return errors to EDIT view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/edit-inventory", {
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      classificationSelect,
      errors,
      inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    })
    return
  }
  next()
}

module.exports = validate