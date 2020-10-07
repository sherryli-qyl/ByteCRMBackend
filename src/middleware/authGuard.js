const { validateToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json('Access denied');

  // Authorization: Bearer {token}
  const contentArr = authHeader.split(' ');
  // true || false -> true
  // true || true -> true
  // false || false -> false
  if (contentArr.length !== 2 || contentArr[0] !== 'Bearer')
    return res.status(401).json('Access denied');

  const decoded = validateToken(contentArr[1]);
  if (!decoded) {
    return res.status(401).json('Access denied');
  }
  req.user = decoded;
  return next();
};


