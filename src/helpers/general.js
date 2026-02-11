const crypto = require('crypto');

const fns = {
  generateToken,
};

async function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = fns;
