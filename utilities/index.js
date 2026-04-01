const invModel = require("../models/inventory-model")
const Util = {}

/* **************************************
 * Build the navigation bar
 * ************************************ */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list += `<a href="/inv/type/${row.classification_id}" title="See ${row.classification_name}">${row.classification_name}</a>`
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
 * Build the classification view HTML 
 * ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/' + vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
      + ' on CSE Motors"></a>'
      grid += '<div class="namePrice">'
      grid += '<hr>'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id + '" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * TAREA 1: Build the vehicle detail view HTML
 * ************************************ */
Util.buildVehicleDisplay = async function (data) {
  let display
  if (data) {
    display = '<div id="vehicle-details-container">'
    display += '<div class="vehicle-image">'
    display += '<img src="' + data.inv_image + '" alt="Image of ' + data.inv_make + ' ' + data.inv_model + '">'
    display += '</div>'
    display += '<div class="vehicle-info">'
    display += '<h2>' + data.inv_make + ' ' + data.inv_model + ' Details</h2>'
    display += '<p class="price"><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</p>'
    display += '<p class="description"><strong>Description:</strong> ' + data.inv_description + '</p>'
    display += '<p class="color"><strong>Color:</strong> ' + data.inv_color + '</p>'
    display += '<p class="miles"><strong>Mileage:</strong> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + ' miles</p>'
    display += '</div>'
    display += '</div>'
  } else {
    display = '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return display
}

/* ****************************************
 * Middleware to handle errors
 * Wrap other function in this for 
 * Global Error Handling
 * *************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
 * Construir la lista de clasificación (Select)
 * ************************************* */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

module.exports = Util