const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0] ? data[0].classification_name : "Vehicles"
  res.render("./inventory/classification", { title: className, nav, grid })
}

// AQUÍ ESTÁ EL ARREGLO
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryById(inv_id)
  const grid = await utilities.buildVehicleDisplay(data)
  let nav = await utilities.getNav()
  
  const reviews = await reviewModel.getReviewsByInvId(inv_id)
  
  res.render("./inventory/detail", { 
    title: data.inv_make + " " + data.inv_model, 
    nav, 
    grid, 
    reviews, 
    inv_id 
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", { title: "Vehicle Management", nav, classificationSelect, errors: null })
}

invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0] && invData[0].inv_id) { return res.json(invData) } else { next(new Error("No data returned")) }
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", { title: "Add New Classification", nav, errors: null })
}

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)
  if (result) { req.flash("notice", `The ${classification_name} classification was added.`); res.redirect("/inv/") } 
  else { let nav = await utilities.getNav(); res.render("./inventory/add-classification", { title: "Add New Classification", nav, errors: null }) }
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", { title: "Add New Vehicle", nav, classificationSelect, errors: null })
}

invCont.addClassificationInventory = async function (req, res) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  const regResult = await invModel.registerVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
  if (regResult) { req.flash("notice", `The ${inv_make} ${inv_model} was added.`); res.redirect("/inv/") } 
  else { let nav = await utilities.getNav(); const classificationSelect = await utilities.buildClassificationList(classification_id); res.render("./inventory/add-inventory", { title: "Add New Vehicle", nav, classificationSelect, errors: null }) }
}

invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  res.render("./inventory/edit-inventory", { title: "Edit " + itemData.inv_make, nav, classificationSelect, errors: null, inv_id: itemData.inv_id, inv_make: itemData.inv_make, inv_model: itemData.inv_model, inv_year: itemData.inv_year, inv_description: itemData.inv_description, inv_image: itemData.inv_image, inv_thumbnail: itemData.inv_thumbnail, inv_price: itemData.inv_price, inv_miles: itemData.inv_miles, inv_color: itemData.inv_color, classification_id: itemData.classification_id })
}

invCont.updateInventory = async function (req, res, next) {
  const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body
  const updateResult = await invModel.updateInventory(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id)
  if (updateResult) { req.flash("notice", `The ${updateResult.inv_make} was updated.`); res.redirect("/inv/") } 
  else { let nav = await utilities.getNav(); const classificationSelect = await utilities.buildClassificationList(classification_id); res.render("inventory/edit-inventory", { title: "Edit " + inv_make, nav, classificationSelect, errors: null, inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id }) }
}

invCont.deleteView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  res.render("./inventory/delete-confirm", { title: "Delete " + itemData.inv_make, nav, errors: null, inv_id: itemData.inv_id, inv_make: itemData.inv_make, inv_model: itemData.inv_model, inv_year: itemData.inv_year, inv_price: itemData.inv_price })
}

invCont.deleteItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)
  if (deleteResult) { req.flash("notice", "Deleted."); res.redirect("/inv/") } 
  else { req.flash("notice", "Delete failed."); res.redirect(`/inv/delete/${inv_id}`) }
}

invCont.triggerError = (req, res, next) => { next({status: 500, message: "Intentional Error"}) }

module.exports = invCont