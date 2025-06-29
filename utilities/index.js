const invModel = require('../models/inventory-model')
const { body, validationResult } = require('express-validator');
const Util = {}
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

  /* ***********************
 * Build the unable to find page view HTML
 * ********************** */
Util.unableToFindPage = async function() {
  let pageNotFound = ''
  return pageNotFound += `
    <h2>Those are uncharted waters!</h2>
  `
}

/* ***********************
 * Build the classification list
 * ********************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassification()
  let classificationList =
      '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a classification</option>"
  data.rows.forEach((row) => {
      classificationList += `<option value="${row.classification_id}"${classification_id == row.classification_id ? " selected" : ""}>${row.classification_name}</option>`
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1]; // Support both cookies and headers
    if (!token) {
      // Only log a warning if the route requires authentication
      if (req.originalUrl.startsWith("/account") || req.originalUrl.startsWith("/inv")) {
        console.warn(`JWT Token is missing for protected route: ${req.originalUrl}`);
      }
      res.locals.isLoggedIn = false; // Set logged-in status to false
      return next(); // Allow the request to proceed
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify token
    req.user = decoded; // Attach the decoded payload to the request
    res.locals.isLoggedIn = true; // Set logged-in status to true
    res.locals.user = decoded; // Pass user data to views
    next();
  } catch (error) {
    console.error(`Error in JWT Validation for route ${req.originalUrl}: ${error.message}`);
    res.locals.isLoggedIn = false; // Set logged-in status to false
    next(); // Allow the request to proceed
  }
};

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.isLoggedIn) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

  /* ****************************************
 *  Check user authorization
 * ************************************ */
Util.checkAdminOrEmployee = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("JWT Token:", token); // Debugging line
  if (!token) {
    req.flash("notice", "You must be logged in to access this page");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded account_type:", decoded.account_type); // Debugging line
    if (decoded.account_type === 'Admin' || decoded.account_type === 'Employee') {
      next();
    } else {
      req.flash("notice", "You do not have permission to access this page");
      return res.redirect("/");;
    }
  } catch (err) {
    req.flash("notice", "Invalid token, please log in again");
    return res.redirect("/account/login");
  }
}


module.exports = Util