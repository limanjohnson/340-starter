const pool = require('../database');

/* ****************************
 * Add a new favorite
 * *************************** */
async function addFavorite(account_id, inventory_id) {
    try {
        const sql = `
            INSERT INTO favorites (account_id, inventory_id)
            VALUES ($1, $2)
            RETURNING *;
        `
        const result = await pool.query(sql, [account_id, inventory_id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error in addFavorite: " + error.message);
        throw error;
    }
}

/* ****************************
 * Display favorites
 * *************************** */
async function getFavoritesByAccountId(account_id) {
    try {
        const sql = `
            SELECT f.favorite_id, i.inv_make, i.inv_model, i.inv_year, i.inv_image
            FROM favorites f
            JOIN inventory i on f.inventory_id = i.inv_id
            WHERE f.account_id = $1;
        `;
        const result = await pool.query(sql, [account_id]);
        return result.rows;
    } catch (error) {
        console.error("Error in getFavoritesByAccountId: " + error.message);
        throw error;
    }
}

/* ****************************
 * Remove a favorite
 * *************************** */
async function removeFavorite(favorite_id) {
    try {
        const sql = `
            DELETE FROM favorites
            WHERE favorite_id = $1;
        `;
        const result = await pool.query(sql, [favorite_id]);
        return result.rowCount;
    } catch (error) {
        console.error("Error in removeFavorite: " + error.message);
        throw error;
    }
}

module.exports = { addFavorite, getFavoritesByAccountId, removeFavorite }