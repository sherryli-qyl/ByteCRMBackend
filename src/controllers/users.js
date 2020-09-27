const User = require('../models/user');
const { generateToken } = require('../utils/jwt');

async function addUser(req, res) {
  const { firstname, lastname, email, password } = req.body;
  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    return res.status(409).json('email already existed');
  }

  const user = new User({
    firstname,
    lastname,
    email,
    password,
  });

  await user.hashPassword();
  await user.save();
  const token = generateToken(user._id);
  return res.json({ firstname, lastname, email, token});
}

module.exports = { addUser };
