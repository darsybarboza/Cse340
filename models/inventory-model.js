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

module.exports = {getClassifications, getInventoryByClassificationId, getItemByInvId, addNewClassification, addNewVehicle};