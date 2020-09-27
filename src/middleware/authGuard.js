const { validateToken } = require('../utils/jwt');
const { decode } = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json('Access denied');

  // Authorization: Bearer {token}
  const contentArr = authHeader.split(' ');
  console.log(contentArr);
  if (contentArr.length !== 2 || contentArr[0] !== 'Bearer')
    return res.status(401).json('Access denied');

  const decoded = validateToken(contentArr[1]);
  if (!decoded) {
    return res.status(401).json('Access denied');
  }
    req.user = decoded;
    return next();
};
