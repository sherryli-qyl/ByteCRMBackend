const Company = require ('../models/company');
const Contact = require ('../models/contact');

// const Joi = require('joi');
// express-async-errors
// function tryCatch(routeHandler) {
//   return (req, res, next) => {
//     try {
//       routeHandler(req, res, next);
//     } catch (e) {
//       next(e);
//     }
//   }
// }

// const asyncHandler = (fn) => (req, res, next) => {
//   return Promise.resolve(fn(req, res, next)).catch(next);
// };

async function addCompany(req, res) {
    const { name, code, description } = req.body;
    const existingCompany = await Company.findById(code).exec();
    if (existingCompany) {
      return res.status(409).json ('Duplicate course code');
    }

    const company = new Company({
      name,
      code,
      description
    });
    await company.save();
    return res.status(201).json(company);
  }

async function getCompany(req, res){
    const {code} = req.params;
    const company = await Company.findById(code)
    .populate('contacts')
    .exec();
    if (!company){
        return res.status(404).json('company not found');
    }
    return res.json(company);
}

async function getAllCompanies(req, res){
   const companies = await Company.find().exec();
   return res.json(companies);
}

async function updateCompany(req, res) {
    const { code } = req.params;
    const { name, description } = req.body;
    const company = await Company.findByIdAndUpdate(
      code,
      { name, description },
      {
        new: true // return the updated object
        // runValidators: true // run validator against new value
      }
    ).exec();
    //
  // const company = await Company.findById(code);
    if (!company) {
      return res.status(404).json('Company not found');
    }
    await company.save();
    return res.json(company);
  };

async function deleteCompany(req, res){
    const { code } = req.params;
    const company = await Company.findByIdAndDelete(code).exec();
    if (!company) {
        return res.status(404).json('company not found');
    }
  // clean refs
  // db.collections.updateMany
  await Contact.updateMany(
    { companies: company._id },
    {
      $pull: {
        companies: company._id
      }
    }
  ).exec();

    return res.status(204).json(company);
};

async function addContact (req, res){
  const {code, id} = req.params;
  const company = await Company.findById(code).select('contacts').exec();
  const contact = await Contact.findById(id).select('companies').exec();

  if (!contact||!company){
    return res.status(404).json('contact or company not exist');
  }
  company.contacts.addToSet(contact._id);
  contact.companies.addToSet(company._id);

  await company.save();
  await contact.save();
  return res.json(company);
};

async function removeContact (req, res){
  const {code, id} = req.params;
  //find company,contact
  const company = await Company.findById(code).select('contacts').exec();
  const contact = await Contact.findById(id).select('companies').exec();
 //check whether contact/company exist
  if (!contact||!company) {
    return res.status(404).json('contact or company not exist');
  }
      //clean refs
      company.contacts.pull(contact._id);
      contact.companies.pull(company._id);
      

  await company.save();
  await contact.save();
  return res.status(204).json(company);
  //return res.sendStatus(204);
}

module.exports = {
    addCompany,
    getCompany,
    getAllCompanies,
    updateCompany,
    deleteCompany,
    addContact,
    removeContact
}