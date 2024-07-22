const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}
let cookies

//Controls the nav HTML unordered list
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
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

//Build the classification view HTML
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
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

Util.buildIndividualView = async function(car_data, review_data, users_data, inv_id) {
    let content
    if(car_data.length > 0){
        content = `<section id="vehicle-info">
        <img src="${car_data[0].inv_image}" alt="Image of ${car_data[0].inv_year} ${car_data[0].inv_model} ${car_data[0].inv_make}">
        <div id="vehicle-details">
            <h2>${car_data[0].inv_model} ${car_data[0].inv_make} Details</h2>
            <ul>
                <li><b>Price: $${new Intl.NumberFormat('en-US').format(car_data[0].inv_price)}</b></li>
                <li><b>Description</b>: ${car_data[0].inv_description}</li>
                <li><b>Color</b>: ${car_data[0].inv_color}</li>
                <li><b>Miles</b>: ${new Intl.NumberFormat('en-US').format(car_data[0].inv_miles)}</li>
            </ul>
        </div>
    </section>
    <section id="vehicle-reviews">
        <h3>Customer Reviews</h3>`
        if (review_data.length > 0) {
          content += `<ul>`
          review_data.forEach((review) => {
            let username
            users_data.forEach((user_data) => {
              if (user_data.account_id == review.account_id) {
                username = user_data.account_firstname
              }
            })
            content += `<li>
                <p><strong>${username}</strong> wrote on ${review.review_date}</p>
                <hr>
                <p>${review.review_text}</p>
            </li>`})
          content += `</ul>
      </section>`
        } else {
          content += `<p id="be_the_first">Be the first to write a review.</p>`
        }
        
      if (cookies.jwt) {
        content += `<h3>Write your review</h3>
        
        <form class="registration-form" action="/inv/detail/:invId" method="post">
            <label>Share details of your experience:</label>
            <label><textarea id="review_text" name="review_text" class="registration-input" placeholder="In CSE Motors we found the perfect car for our family trips..."></textarea></label>
            <div class="button-holder">
                <button class="registration-button">Submit Review</button>
            </div>
            <input type="hidden" name="inv_id" value=${inv_id}>
        </form>`
      } else {
      content += `<p>You must <a href="/account/login">login</a> to write a review`
      }
    } else { 
        content = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return content
}

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

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  cookies = req.cookies
    if (req.cookies.jwt) {
     jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
       if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
       }
       res.locals.accountData = accountData
       res.locals.loggedin = 1
       next()
      })
    } else {
     next()
    }
   }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Get the account data
 * ************************************ */
Util.getAccountData = (req, res, next) => {
  return jwt.verify(cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
}

/* ****************************************
 *  Get the account link(s)
 * ************************************ */
Util.getAccountLinks = (req, res, next) => {
  let links
    if (cookies.jwt) {
      let account_data = jwt.verify(cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
      links = `<a title="Manage account" href="/account/">Welcome ${account_data.account_firstname}  | </a>
      <a title="Click to log out" href="/logout">Logout</a>`
      return links
    } else {
    links = `<a title="Click to log in" href="/account/login">My Account</a>`
    return links
    }
} 

/* ****************************************
*  Check account type
* ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (cookies.jwt) {
    let account_data = jwt.verify(cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
    if (account_data.account_type == "Client") {
      req.flash("notice", "Access Denied: Employees and Administrators Only")
      return res.redirect("/account/login")
    } else {
      next()
    }
  } else {
    req.flash("notice", "Access Denied: Employees and Administrators Only")
    return res.redirect("/account/login")
  }
}

/* ****************************************
*  Build account management view
* ************************************ */
Util.buildAccountManagementView = async function (review_data) {
  let account_data = jwt.verify(cookies.jwt, process.env.ACCESS_TOKEN_SECRET)
  let content = `<h2>Welcome ${account_data.account_firstname}</h2>
  <p>You're logged in.</p>
  <a href="/account/update">Edit Account Information</a>`
  
  if (review_data) {
    content += `<h2>My Reviews</h2>
    <ol>`
    review_data.forEach((review) => {
      content += `<li>Reviewed the ${review.inv_year} ${review.inv_make} ${review.inv_model} on ${review.review_date} | <a href="/account/edit-review">Edit</a> | <a href="/account/delete-review">Delete</a></li>`
    })
    content += `</ol>`
  }
  
  
  if (account_data.account_type != "Client") {
    content += `
    <h3>Inventory Management</h3>
    <a href="/inv">Manage Inventory</a>`
  }

  return content
}


//Error handling
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util