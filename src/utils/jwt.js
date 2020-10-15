const jwt = require('jsonwebtoken');
const { valid } = require('joi');
const { JWT_KEY } = process.env;

//access token
//refresh token -> oauth, sso
function generateToken(id) {
  const token = jwt.sign({ id }, JWT_KEY, { expiresIn: '60d' });
  return token;
}

// function generateToken(id) {
//   const token = jwt.sign({ id }, JWT_KEY, { expiresIn: '10d' });
//   return token;
// }

function validateToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_KEY);
  } catch (e) {
    return null;
  }
  return decoded;

  // return new Promise((res, rej)=> {
  //   try {
  //     decoded = jwt.verify(token, JWT_KEY);
  //   } catch (e) {
  //     rej(e);
  //   }
  // })
}

//await validateToken(token);

module.exports = { generateToken, validateToken };
