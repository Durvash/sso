const db = require('../../config/db');

const authModel = {
  finduserByEmail,
  getUserById,
  getUserList,
  insertUser,
  updateUser,
  deleteUser,
};

async function finduserByEmail(email) {
  try {
    const query = 'SELECT id, email, password_hash FROM users WHERE email = $1 LIMIT 1';
    const values = [email];
    const result = await db.query(query, values);
    return [result?.rows, null];
  } catch (e) {
    return [null, e]
  }
}

async function getUserById(id) {
  try {
    const query = 'SELECT * FROM getuserdata($1)';
    const values = [id];
    const result = await db.query(query, values);
    return [result?.rows, null];
  } catch (e) {
    return [null, e]
  }
}

async function getUserList() {}

async function insertUser(data) {
  try {
    const { full_name, email, password } = data;
    const query = 'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id';
    const values = [full_name, email, password];
    const result = await db.query(query, values);
    return [result?.rows, null];
  } catch (e) {
    return [null, e];
  }
}

async function updateUser() {}

async function deleteUser() {}

module.exports = authModel;
