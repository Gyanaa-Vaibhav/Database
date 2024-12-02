import pool from './pool.js'

async function getAllUsernames() {
    const { rows } = await pool.query("SELECT * FROM usernames");
    return rows;
}

async function insertUsername(username) {
    const query = "INSERT INTO usernames (username) VALUES ($1)"
    const values = [username]
    await pool.query(query, values);
}

export {
    getAllUsernames,
    insertUsername
}
