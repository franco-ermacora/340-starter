const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const revCont = {}

/* ******************************
 * Agregar nueva reseña (POST)
 * **************************** */
revCont.addReview = async function (req, res) {
  try {
    const { review_text, inv_id, account_id } = req.body
    
    // Llamamos al modelo para insertar la reseña
    const result = await reviewModel.addReview(review_text, inv_id, account_id)

    if (result) {
      req.flash("notice", "Success! Your review has been added.")
      res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash("notice", "Sorry, there was an error adding your review.")
      res.redirect(`/inv/detail/${inv_id}`)
    }
  } catch (error) {
    // Si algo sale mal (ej. error de conexión a DB), esto lo atrapa
    console.error("Error en addReview: ", error)
    req.flash("notice", "A server error occurred while posting your review.")
    res.redirect("/inv/")
  }
}

module.exports = revCont