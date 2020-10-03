const Contact = require("../models/contact");
const Company = require("../models/company");

let id = 0xaa;

async function addContact(req, res) {
  const {
    name,
    email,
    phoneNumber,
    contactOwner,
    companies,
    lastActivityDate,
    leadStatus,
    createDate,
  } = req.body;
  const contact = new Contact({
    id, 
    name,
    email,
    phoneNumber,
    contactOwner,
    companies,
    lastActivityDate,
    leadStatus,
    createDate,
  });
  id++;
  await contact.save();

  return res.json({ body: contact, status: "success", err: "error" });
}

async function getContactById(req, res) {
  const { id } = req.params;
  const contact = await Contact.findById(id)
    .populate("companies", "code name")
    .exec();
  if (!contact) {
    return res.status(404).json("contact not found");
  }
  return res.json(contact);
}

async function getAllContacts(req, res) {
  const { q = "", fields } = req.query; //per_page or camelCase

  const contacts = await Contact.find().exec();
  // Contact.find({$or:[{firstName: {$regex: q}},{lastName: {$regex:q}}]})
  // new RegExp(req.query.q);
  // Contact.find().select(select)
  //   return res.json(contacts);
  return res.json({ data: contacts, pagination: totalCount });
}

async function updateContactById(req, res) {
  const { id } = req.params;
  const {
    name,
    email,
    phoneNumber,
    contactOwner,
    companies,
    lastActivityDate,
    leadStatus,
    createDate,
  } = req.body;
  const newContact = await Contact.findByIdAndUpdate(id, {
    name,
    email,
    phoneNumber,
    contactOwner,
    companies,
    lastActivityDate,
    leadStatus,
    createDate,
  }).exec();
  if (!newContact) {
    return res.status(404).json("contact not found");
  }
  return res.status(202).json(newContact);
}

async function deleteContactById(req, res) {
  const { id } = req.params;
  const contact = await Contact.findByIdAndDelete(id).exec();
  if (!contact) {
    return res.status(404).json("contact not found");
  }
  await Company.updateMany(
    { _id: { $in: contact.companies } }, //{ contacts: contact._id },
    {
      $pull: {
        contacts: contact._id,
      },
    }
  ).exec();
  return res.status(200).json(contact);
}

async function addCompany(req, res) {
  const { id, code } = req.params;
  const contact = await Contact.findById(id).select("companies").exec();
  const company = await Company.findById(code).select("contacts").exec();

  if (!contact || !company) {
    return res.status(404).json("contact or company not exist");
  }
  contact.companies.addToSet(company._id);
  company.contacts.addToSet(contact._id);

  await contact.save();
  await company.save();
  return res.json(contact);
}
//get contact id, get company code
//find company
//find contact
//check contact or company whether exist
//add company to contact
//the same contact should not add company twice

//TODO: add contact to company
//the same company should not add contact twice

//save contact and company

//return saved contact

async function removeCompany(req, res) {
  const { id, code } = req.params;
  // find company,contact
  const contact = await Contact.findById(id).select("companies").exec();
  const company = await Company.findById(code).select("contacts").exec();
  //check company/contact whether exist

  if (!contact || !company) {
    return res.status(404).json("contact or company not exist");
  }
  //clean refs
  company.contacts.pull(contact._id);
  contact.companies.pull(company._id);

  await company.save();
  await contact.save();
  return res.status(200).json(contact);
  // return res.sendStatus(200);
}

module.exports = {
  addContact,
  getContactById,
  getAllContacts,
  updateContactById,
  deleteContactById,
  addCompany,
  removeCompany,
};
