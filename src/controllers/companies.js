const Company = require("../models/company");
const Contact = require("../models/contact");
const User = require("../models/user");
const { findRedunDant, findNew } = require('../utils/findDiff');

async function addCompany(req, res) {
  const {
    name,
    lastLoggedCallDate,
    phoneNumber,
    companyDomain,
    city,
    type,
    state_region,
    country,
    industry,
  } = req.body;

  const existingCompany = await Company.findOne({ name: name }).exec();
  if (existingCompany) {
    return res.status(409).json("Duplicate company name");
  }
  const company = new Company({
    name,
    lastLoggedCallDate,
    companyDomain,
    phoneNumber,
    type,
    state_region,
    city,
    country,
    industry,
  });
  await company.save();
  return res.status(201).json(company);
}

async function getCompanyByCode(req, res) {
  const { code } = req.params;
  const company = await Company.findById(code)
    .populate("associatedContacts", "firstName lastName email jobTitle phoneNo")
    .populate("companyOwner", "firstName lastName")
    .exec();
  if (!company) {
    return res.status(404).json("company not found");
  }
  return res.json(company);
}

async function searchCompanyByUserId(req, res) {
  const { userId, keywords } = req.params;
  const UpperCaseKeywords = keywords.toUpperCase();
  const companies = await Company.find(
    { companyOwner: userId },
    "name companyDomain phoneNumber"
  );

  let findCompanies = [];
  for (let i in companies) {
    console.log(companies[i].companyDomain);
    if (
      companies[i].name.toUpperCase().includes(UpperCaseKeywords) ||
      companies[i].companyDomain && companies[i].companyDomain.toUpperCase().includes(UpperCaseKeywords)
    ) {
      findCompanies.push(companies[i]);
    }
  }
  if (findCompanies.length >= 1) {
    return res.status(200).json(findCompanies);
  } else {
    return res.status(404).json("no user found");
  }
}

async function getAllCompanies(req, res) {
  const companies = await Company.find()
    .populate({
      path: "companyOwner",
      select: "firstName lastName",
    })
    .populate({
      path: "associatedContacts",
      select: "firstName lastName",
    })
    .exec();
  return companies
    ? res.status(200).json(companies)
    : res.status(404).json("No companies");
}

async function updateCompany(req, res) {
  const { code } = req.params;
  console.log(req.body)
  const company = await Company.findByIdAndUpdate(code, req.body, {
    new: true,
  }).exec();
  if (!company) {
    return res.status(404).json("Company not found");
  }
  return res.status(202).json(company);
}

// TO BE FINISHED
async function deleteCompany(req, res) {
  const { code } = req.params;
  const company = await Company.findById(code).exec();
  if (!company) {
    return res.status(404).json("company not found");
  }
  if (company.associatedContacts) {
    for (let id of company.associatedContacts) {
      let contact = await Contact.findById(id).exec();
      console.log("deleteCompany -> contact", contact);
      contact.update({ $set: { company: undefined } });
      await contact.save();
    }
  }
  if (company.companyOwner) {
    const user = await User.findById(company.companyOwner).exec();
    user.companies.pull(company._id);
    console.log("deleteCompany -> user", user);
    await user.save();
  }
  // await Contact.updateMany(
  //   { company: company._id },
  //   {
  //     $pull: {
  //       company: company._id,
  //     },
  //   }
  // ).exec();
  // await User.updateMany(
  //   { companies: company._id },
  //   {
  //     $pull: {
  //       companies: company._id,
  //     },
  //   }
  // ).exec();
  const deleteCompany = await Company.findByIdAndDelete(code).exec();
  return res.status(204).json(deleteCompany);
}

async function addContact(req, res) {
  const { code, id } = req.params;
  const company = await Company.findById(code).select("contacts").exec();
  const contact = await Contact.findById(id).select("companies").exec();

  if (!contact || !company) {
    return res.status(404).json("contact or company not exist");
  }
  company.contacts.addToSet(contact._id);
  contact.companies.addToSet(company._id);

  await company.save();
  await contact.save();
  return res.json(company);
}

async function removeContact(req, res) {
  const { code, id } = req.params;
  //find company,contact
  const company = await Company.findById(code).select("contacts").exec();
  const contact = await Contact.findById(id).select("companies").exec();
  //check whether contact/company exist
  if (!contact || !company) {
    return res.status(404).json("contact or company not exist");
  }
  //clean refs
  company.contacts.pull(contact._id);
  contact.companies.pull(company._id);

  await company.save();
  await contact.save();
  return res.status(204).json(company);
  //return res.sendStatus(204);
}

async function multiRefChange(req, res) {
  const { code } = req.params;
  const { contacts } = req.body;
  console.log(code);
  console.log(contacts);
  const company = await Company.findById(code).exec();

  if (!company) {
    return res.status(404).json("company not exist");
  }

  const existContacts = company.associatedContacts;

  const removedContacts = findRedunDant(existContacts, contacts);
  console.log(2222);
  console.log(removedContacts);

  for (let i in removedContacts) {
    company.associatedContacts.pull(removedContacts[i]);
    
    const contact = await Contact.findById(removedContacts[i]).exec();
    if (!contact) {
      return res.status(404).json("contact not exist");
    }
    contact.company = undefined;
    await contact.save();
  }

  const addContacts = findNew(contacts, company.associatedContacts);

  for (let i in addContacts) {
    const contact = await Contact.findById(addContacts[i]).exec();
    company.associatedContacts.addToSet(contact.id);
    if (!contact) {
      return res.status(404).json("contact not exist");
    }
    contact.company = company;
    await contact.save();
  }
  await company.save();
  const result = await Company.findById(code)
  .populate("associatedContacts", "firstName lastName email jobTitle phoneNo")
  .exec();
  return res.status(200).json(result);
}


module.exports = {
  addCompany,
  getCompanyByCode,
  getAllCompanies,
  updateCompany,
  deleteCompany,
  addContact,
  removeContact,
  searchCompanyByUserId,
  multiRefChange,
};
