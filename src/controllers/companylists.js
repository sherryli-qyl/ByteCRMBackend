const Companylist = require('../models/companylist');

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

async function addCompanylist(req, res) {
  const { 
    name,
    code,
    company_owner,
    creat_date,
    lastactivity_date,
    phone_number,
    city,
    country,
    industry
  } = req.body;
  const existingCompanylist = await Companylist.findById(code).exec();
  if (existingCompanylist) {
    return res.status(409).json('Duplicate course code');
  }

  const companylist = new Companylist(
    {
      name,
      code,
      company_owner,
      creat_date,
      lastactivity_date,
      phone_number,
      city,
      country,
      industry
    });
  await companylist.save();
  return res.status(201).json(companylist);
}

async function getCompanylist(req, res) {
  const { code } = req.params;
  const companylist = await Companylist.findById(code).exec();
  if (!companylist) {
    return res.status(404).json('companylist not found');
  }
  return res.json(companylist);
}

async function getAllCompanylists(req, res) {
  const companylists = await Companylist.find().exec();
  return res.json(companylists);
}

async function updateCompanylist(req, res) {
  const { code } = req.params;
  const
    { name,
      company_owner,
      creat_date,
      lastactivity_date,
      phone_number,
      city,
      country,
      industry
    } = req.body;

  const companylist = await Companylist.findByIdAndUpdate(
    code,
    {
      name,
      company_owner,
      creat_date,
      lastactivity_date,
      phone_number,
      city,
      country,
      industry
    },
    {
      new: true // return the updated object
      // runValidators: true // run validator against new value
    }
  ).exec();
  //
  // const companylist = await Companylist.findById(code);
  if (!companylist) {
    return res.status(404).json('Companylist not found');
  }
  await companylist.save();
  return res.json(companylist);
};

async function deleteCompanylist(req, res) {
  const { code } = req.params;
  const companylist = await Companylist.findByIdAndDelete(code).exec();
  if (!companylist) {
    return res.status(404).json('companylist not found');
  }
  // clean refs
  // db.collections.updateMany

  return res.status(204).json(companylist);
};



module.exports = {
  addCompanylist,
  getCompanylist,
  getAllCompanylists,
  updateCompanylist,
  deleteCompanylist,
}