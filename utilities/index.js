const invModel = require('../models/inventory-model')
const Util = {}

/* ***********************
 * Constructs the nav HTML unordered list
 * ********************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassification()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* ***********************
 * Build the classification view HTML
 * ********************** */

Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => {
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View '
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
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

  /* ***********************
 * Build the details view HTML
 * ********************** */
Util.buildDetailPage = async function(data){
  let singleView = ''

  if (data.length > 0) {
  singleView = '<div id="single-display">'
  data.forEach(vehicle => {
    singleView += `
      <div class="vehicle-details">
        <div class="image">
          <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}"/>
        </div>
        <div class="details">
          <h2 class="details-item">${vehicle.inv_make} ${vehicle.inv_model}</h2>
          <p class="details-item">Year: ${vehicle.inv_year}</p>
          <p class="details-item">${vehicle.inv_description}</p>
          <p class="details-item">Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>
          <p class="details-item">Mileage: ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>
          <p class="details-item">Color: ${vehicle.inv_color}</p>
        </div>
      </div>
    `
  })
  singleView += "</div>"

  } else {
    singleView += '<p class="notice">Sorry, this is not working correctly.</p>'
  }
return singleView
}

module.exports = Util