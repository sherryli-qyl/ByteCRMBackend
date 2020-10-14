const Contact = require("../models/contact");
const Company = require("../models/company");
const User = require("../models/user");

async function addContact(req, res) {
  const {
    firstName,
    lastName,
    email,
    jobTitle,
    phoneNo,
    lifeCycle,
    company,
    lastActivityDate,
    leadStatus,
    createDate,
  } = req.body;
  const contact = new Contact({
    firstName,
    lastName,
    email,
    jobTitle,
    phoneNo,
    lifeCycle,
    company,
    lastActivityDate,
    leadStatus,
    createDate,
  });
  await contact.save();
  return res.json(contact);
}

async function getContact(req, res) {
  const { id } = req.params;
  const contact = await Contact.findById(id)
    .populate("company", "name")
    .populate("contactOwner", "firstName lastName email")
    .exec();
  if (!contact) {
    return res.status(404).json("contact not found");
  }
  return res.status(200).json(contact);
}

async function searchContactByUserId(req, res) {
  const { userId, keywords } = req.params;
  const UpperCaseKeywords = keywords.toUpperCase();
  const contact = await Contact.find(
    { contactOwner: userId },
    "firstName lastName fullName email"
  );
  let findContacts = [];
  for (let i in contact) {
    if (
      contact[i].fullName.toUpperCase().includes(UpperCaseKeywords) ||
      contact[i].email.toUpperCase().includes(UpperCaseKeywords)
    ) {
      findContacts.push(contact[i]);
    }
  }
  if (findContacts.length >= 1) {
    return res.status(200).json(findContacts);
  } else {
    return res.status(404).json("no user found");
  }
}

async function getAllContacts(req, res) {
  let contacts = await Contact.find()
    .populate({
      path: "company",
      select: "name",
    })
    .populate({
      path: "contactOwner",
      select: "firstName lastName",
    })
    .exec();
  return res.status(200).json(contacts);
  // // fields来自query params
  // const { page = 1, pageSize = 10, q = "", fields } = req.query;
  // const limit = Math.max(pageSize * 1, 10);
  // const skip = (Math.max(page * 1, 1) - 1) * limit;
  // const contacts = await Contact.find().limit(limit).skip(skip).exec();
  // return res.status(200).json(contacts);
}

async function updateContact(req, res) {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    phoneNo,
    lifeCycle,
    jobTitle,
    contactOwner,
  } = req.body;
  const newContact = await Contact.findByIdAndUpdate(id, {
    firstName,
    lastName,
    phoneNo,
    lifeCycle,
    jobTitle,
    contactOwner,
  }).exec();
  if (!newContact) {
    return res.status(404).json("contact not found");
  }
  return res.status(202).json(newContact);
}

async function deleteContact(req, res) {
  const { id } = req.params;
  const contact = await Contact.findById(id).exec();
  if (contact.company) {
    const company = await Company.findById(contact.company).exec();
    company.contacts.pull(contact._id);
    await company.save();
  }
  if (contact.contactOwner) {
    const user = await User.findById(contact.contactOwner).exec();
    user.contacts.pull(contact._id);
    await user.save();
  }
  const deleteContact = await Contact.findByIdAndDelete(id).exec();
  return res.status(200).json(deleteContact);
}

async function updateUser(req, res) {
  const { contactId, userId } = req.params;
  const contact = await Contact.findById(contactId).exec();

  if (!contact) {
    return res.status(404).json("contact not exist");
  }
  if (contact.contactOwner) {
    const oldUser = await User.findById(contact.contactOwner).exec();
    oldUser.contacts.pull(contact._id);
    await oldUser.save();
  }

  const newUser = await User.findById(userId).exec();
  newUser.contacts.addToSet(contact._id);
  contact.contactOwner = newUser._id;

  await contact.save();
  await newUser.save();
  return res.json(contact);
}

async function addCompany(req, res) {
  const { id, code } = req.params;
  const contact = await Contact.findById(id).exec();
  const company = await Company.findById(code).exec();
  console.log(company);
  console.log(contact);

  if (!contact || !company) {
    return res.status(404).json("contact or company not exist");
  }
  contact.company = company;
  company.contacts.addToSet(contact._id);

  await contact.save();
  await company.save();
  return res.status(200).json(contact);
}

async function removeCompany(req, res) {
  const { id, code } = req.params;
  const contact = await Contact.findById(id).exec();
  const company = await Company.findById(code).exec();

  if (!contact || !company) {
    return res.status(404).json("contact or company not exist");
  }

  company.contacts.pull(id);
  contact.company = undefined;

  await company.save();
  await contact.save();
  return res.status(200).json(contact);
}

module.exports = {
  addContact,
  getContact,
  getAllContacts,
  updateContact,
  deleteContact,
  addCompany,
  updateUser,
  searchContactByUserId,
  removeCompany,
};
