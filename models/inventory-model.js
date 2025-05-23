const pool = require('../database/')

/* ***************************
 * Get all classification data
 * ************************** */

async function getClassification(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 * Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i
        JOIN public.classification AS c
        ON i.classification_id = c.classification_id
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      if (data.rows.length === 0) {
        const error = new Error(`No inventory items found for that classification ID`)
        error.status = 404
        throw error
      }
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error.message)
      throw error
    }
  }

/* ***************************
 * Get all inventory data
 * ************************** */

async function getInventory() {
  return await pool.query("SELECT * FROM public.inventory ORDER BY inv_id ASC")
}

/* ***************************
 * Get inventory item by inv_id
 * ************************** */
async function getInventoryById(inv_id){
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory where inv_id = $1`,
      [inv_id]
    )
    if (data.rows.length === 0) {
      // throw an error if no inventory items are found
      const error = new Error( `No inventory item exists with that ID`)
      error.status = 404
      throw error
    }
    return data.rows[0] // return a single object
  } catch (error) {
    console.error("getInventoryById error " + error.message)
    throw error
  }
}

module.exports = { getClassification, getInventoryByClassificationId, getInventory, getInventoryById }