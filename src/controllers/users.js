const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

async function addUser(req, res) {
  const { firstName, lastName, email, password } = req.body;
  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    return res.status(409).json('email already existed');
  }

  const user = new User({
    firstName,
    lastName,
    email,
    password
  });

  await user.hashPassword();
  await user.save();
  const token = generateToken(user._id);
  return res.json({ firstName, lastName, email, token});
}

async function getAllUsers(req, res) {
  const users = await User.find().exec();
  return res.json(users);
}

module.exports = { 
  addUser,
  getAllUsers,
};

// POST /api/users/login
// POST /api/auth
