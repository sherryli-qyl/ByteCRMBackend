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
  return res.json({firstName, lastName, email, token});
}

async function searchUser(req,res){
  const {keywords} = req.params;
  const UpperCaseKeywords = keywords.toUpperCase();
  const users = await User.find()
  let findUsers = [];
  for (let i in users) {
    if (
      users[i].fullName.toUpperCase().includes(UpperCaseKeywords) ||
      users[i].email.toUpperCase().includes(UpperCaseKeywords)
    ) {
      findUsers.push(users[i]);
    }
  }
  if (findUsers.length >= 1) {
    return res.status(200).json(findUsers);
  } else {
    return res.status(404).json("no user found");
  }
}

module.exports = { 
  addUser,
  searchUser
};

// POST /api/users/login
// POST /api/auth
