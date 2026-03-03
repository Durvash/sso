const db = require('../../config/db');

const authModel = {
  finduserByEmail,
  getUserById,
  insertUser,
  invitationVerify,
};

async function finduserByEmail(email) {
  try {
    const query = 'SELECT id, email, password_hash FROM users WHERE email = $1 LIMIT 1';
    const values = [email];
    const result = await db.query(query, values);
    return [result?.rows, null];
  } catch (e) {
    return [null, e];
  }
}

async function getUserById(id) {
  try {
    const query = 'SELECT * FROM get_user_data($1)';
    const values = [id];
    const result = await db.query(query, values);
    return [result?.rows, null];
  } catch (e) {
    return [null, e];
  }
}

async function insertUser(data) {
  try {
    const { fullname, email, password } = data;
    const query = 'INSERT INTO users (fullname, email, password_hash) VALUES ($1, $2, $3) RETURNING id';
    const values = [fullname, email, password];
    const result = await db.query(query, values);
    return [result?.rows, null];
  } catch (e) {
    return [null, e];
  }
}

async function invitationVerify(email, token) {
  try {
    const query = 'SELECT * FROM invitations WHERE email = $1 AND token = $2 AND expires_at > now()';
    const values = [email, token];
    const result = await db.query(query, values);
    return [result?.rows, null];
  } catch (e) {
    return [null, e];
  }
}

module.exports = authModel;
