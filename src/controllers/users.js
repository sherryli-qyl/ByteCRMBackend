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
  return res.json({ firstName, lastName, email, token });
}

async function searchUser(req, res) {
  const { keywords, id } = req.params;
  const UpperCaseKeywords = keywords.toUpperCase();
  const user = await User.findById({ _id: id }, "firstName lastName fullName email")
    .populate("relatedUsers", "firstName lastName email fullName")
    .exec();

  let findUsers = [];
  
  for (let i in user.relatedUsers) {
    if (
      user.relatedUsers[i].fullName.toUpperCase().includes(UpperCaseKeywords) ||
      user.relatedUsers[i].email.toUpperCase().includes(UpperCaseKeywords)
    ) {
      findUsers.push(user.relatedUsers[i]);
    }
  }

  if (user.fullName.toUpperCase().includes(UpperCaseKeywords) ||
    user.email.toUpperCase().includes(UpperCaseKeywords)) {
    findUsers.push(user);
  }

  if (findUsers.length >= 1) {
    return res.status(200).json(findUsers);
  } else {
    return res.status(404).json("no user found");
  }
}

async function addRelatedUser(req, res) {
  const { id, relatedId } = req.params;
  const user = await User.findById(id).exec();
  const relatedUser = await User.findById(relatedId).exec();
  if (!user || !relatedUser) {
    return res.status(404).json("no user found");
  }
  user.relatedUsers.addToSet(relatedId);
  relatedUser.relatedUsers.addToSet(id);
  user.save();
  relatedUser.save();
  return res.status(200).json(user);
}

module.exports = {
  addUser,
  searchUser,
  addRelatedUser
};

// POST /api/users/login
// POST /api/auth
