const Company = require ('../models/company');
const Joi = require('joi');


async function addCompany(req, res) {
    const { name, code, description } = req.body;
    // const schema = Joi.object({
    //   name:Joi.string().min(2).max(10).required(),
    //   code:Joi.string().regex(/^[a-zA-z0-9]+$/)
    //   .required(),//require ask for the string is true
    //   description: Joi.string()
    // })
    // const data = await schema.validateAsync(req.body, 
    //   {allowUnknown: true, 
    //     stripUnkown: true
    //   }
    //   )

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
    const company = await Company.findById(code).exec();
    if (!company){
        return res.status(404).json('company not found');
    }
    return res.json(company);

}

async function getAllCompanies(req, res){
   const companies = await Company.find().exec().exec();
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
  }

async function deleteCompany(req, res){
    const { id: code } = req.params;
    const company = await Company.findByIdAndDelete(code).exec();
    if (!company) {
        return res.status(404).json('company not found');
    }
    //return res.sendStatus(204);
    return res.status(204).json(company);

}

module.exports = {
    addCompany,
    getCompany,
    getAllCompanies,
    updateCompany,
    deleteCompany
}