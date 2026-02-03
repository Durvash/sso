const db = require('../../config/db');

const userModel = {
  addcompany,
};

async function addcompany(name, user_id) {
  try {
    const query = 'SELECT * FROM add_company($1,$2)';
    const values = [name, user_id];
    const result = await db.query(query, values);
    return [result?.rows, null];
  } catch (e) {
    return [null, e];
  }
}

async function getUserList() {}

async function updateUser() {}

async function deleteUser() {}

module.exports = userModel;
