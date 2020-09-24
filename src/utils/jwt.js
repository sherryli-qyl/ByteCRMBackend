const jwt = require('jsonwebtoken');
const { JWT_KEY } = process.env;

function generateToken(id) {
  const token = jwt.sign({ id }, JWT_KEY, { expiresIn: '10d' });
  return token;
}

function validateToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_KEY);
  } catch (e) {
    return null;
  }
  return decoded;
}

module.exports = { generateToken, validateToken };
