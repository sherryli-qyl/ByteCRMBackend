const Company = require ('../models/company');
const Contact = require ('../models/contact');

async function addCompany(req, res) {
    const { name, code, description } = req.body;
    const company = new Company({
      name,
      code,
      description
    });
    await company.save();
    return res.json(company);
  }

async function getCompany(req, res){
    const {id: code } = req.params;
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
    const { id: code } = req.params;
    const { name, description } = req.body;
    const newCompany = await Company.findByIdAndUpdate(
      code,
      { name, description },
      {
        new: true // return the updated object
        // runValidators: true // run validator against new value
      }
    );
    if (!newCompany) {
      return res.status(404).json('Company not found');
    }
    return res.json(newCompany);
  };

async function deleteCompany(req, res){
    const { id: code } = req.params;
    const company = await Company.findByIdAndDelete(code).exec();
    if (!company) {
        return res.status(404).json('company not found');
    }
    return res.status(204).json(company);
};

async function addContact (req, res){
  const {code, id} = req.params;
  const company = await Company.findById(code).exec();
  const contact = await Contact.findById(id).exec();

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
  const company = await Company.findById(code).exec();
  const contact = await Contact.findById(id).exec();

  if (!contact||!company) {
    return res.status(404).json('contact or company not exist');
  }
      //clean refs
      await Contact.updateMany({
        companies: company._id}, {
        $pull: {
          companies: company._id
        }
      }).exec();
  await company.save();
  return res.status(202);
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