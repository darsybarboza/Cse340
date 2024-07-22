const pool = require("../database/")

// Gets all classification data
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

// Gets all inventory items and classification_name by classification_id
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

// Gets a specific inventory item information by inv_id
async function getItemByInvId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory
            WHERE inv_id = $1`,
            [inv_id]
        )
        return data.rows
    } catch (error) {
        console.error("getItemByInvId error " + error)
    }
}

// Add new classification
async function addNewClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        console.error("Could not add new classification '" + classification_name + "' " + error)
    }
}

// Add new vehicle
async function addNewVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
    try {
        const sql = 'INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
        return await pool.query(sql, [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color])
    } catch (error) {
        console.error("Could not add new vehicle '" + inv_year + " " + inv_make + " " + inv_model + "' " + error)
    }
}

// Updated vehicle data
async function updateVehicle(inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id) {
    try {
        const sql = 'UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *'
        return await pool.query(sql, [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id])
    } catch (error) {
        console.error("model error: " + error)
    }
}

// Delete vehicle data
async function deleteVehicle(inv_id) {
    try {
        const sql = 'DELETE FROM inventory WHERE inv_id = $1'
        const data = await pool.query(sql, [inv_id])
        return data
    } catch (error) {
        console.error("Delete Inventory Error" + error)
    }
}

// Add vehicle reviews
async function addReview(review_text, inv_id, account_id) {
    try {
        const sql = 'INSERT INTO review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *'
        const data = await pool.query(sql, [review_text, inv_id, account_id])
        return data.rows
    } catch (error) {
        console.error("Add Review Error: " + error)
    }
}

// Get vehicle reviews
async function getReviewsByInvId(inv_id) {
    try {
        const sql = 'SELECT * FROM public.review WHERE inv_id = $1 ORDER BY review_date DESC'
        const data = await pool.query(sql, [inv_id])
        return data.rows
    } catch (error) {
        console.error("Get Reviews Error: " + error)
    }
}

// Get account data for reviews
async function getAccountDataByInvId(inv_id) {
    try {
      const sql = 'SELECT public.account.account_id, account_firstname FROM public.account INNER JOIN public.review ON public.review.account_id = public.account.account_id WHERE public.review.inv_id = $1'
      const data = await pool.query(sql, [inv_id])
      return data.rows
    } catch (error) {
        console.error("Get Account Data Error: " + error)
    }
      
}

// Get review and vehicle data with account_id
async function getReviewAndVehicleData(account_id) {
    try {
        const sql = 'SELECT * FROM public.review INNER JOIN public.inventory ON public.review.inv_id = public.inventory.inv_id INNER JOIN public.account ON public.review.account_id = public.account.account_id WHERE public.review.account_id = $1'
        const data = await pool.query(sql, [account_id])
        return data.rows
    } catch (error) {
        console.error("Get Review and Vehicle Error: " + error)
    }
}

module.exports = {getClassifications, 
                getInventoryByClassificationId, 
                getItemByInvId, 
                addNewClassification, 
                addNewVehicle, 
                updateVehicle, 
                deleteVehicle,
                addReview,
                getReviewsByInvId,
                getAccountDataByInvId,
                getReviewAndVehicleData};