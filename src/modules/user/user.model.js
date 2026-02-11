const db = require('../../config/db');

const userModel = {
  addcompany,
  checkEmailsExist,
  addInvitation
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

async function checkEmailsExist(emails) {
  try {
    const query = 'SELECT email FROM users WHERE email = ANY($1)';
    const values = [emails];
    const result = await db.query(query, values);
    return [result.rows, null];
  } catch (e) {
    return [null, e];
  }
}

async function addInvitation(data) {
  try {
    const { company_id, emails, token } = data;
    const query = 'SELECT * FROM add_invitations($1, $2, $3)';
    const values = [company_id, emails, token];
    const result = await db.query(query, values);
    return [result.rows, null];
  } catch (e) {
    return [null, e];
  }
}

async function updateUser() {}

async function deleteUser() {}

module.exports = userModel;
