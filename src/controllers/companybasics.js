const Companybasic = require ('../models/companybasic');
const Contactbasic = require ('../models/contactbasic');

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

async function addCompanybasic(req, res) {
    const { name, code, description } = req.body;
    const existingCompanybasic = await Companybasic.findById(code).exec();
    if (existingCompanybasic) {
      return res.status(409).json ('Duplicate course code');
    }

    const companybasic = new Companybasic({
      name,
      code,
      description
    });
    await companybasic.save();
    return res.status(201).json(companybasic);
  }

async function getCompanybasic(req, res){
    const {code} = req.params;
    const companybasic = await Companybasic.findById(code)
    .populate('contactbasics')
    .exec();
    if (!companybasic){
        return res.status(404).json('companybasic not found');
    }
    return res.json(companybasic);
}

async function getAllCompanybasics(req, res){
   const companybasics = await Companybasic.find().exec();
   return res.json(companybasics);
}

async function updateCompanybasic(req, res) {
    const { code } = req.params;
    const { name, description } = req.body;
    const companybasic = await Companybasic.findByIdAndUpdate(
      code,
      { name, description },
      {
        new: true // return the updated object
        // runValidators: true // run validator against new value
      }
    ).exec();
    //
  // const companybasic = await Companybasic.findById(code);
    if (!companybasic) {
      return res.status(404).json('Companybasic not found');
    }
    await companybasic.save();
    return res.json(companybasic);
  };

async function deleteCompanybasic(req, res){
    const { code } = req.params;
    const companybasic = await Companybasic.findByIdAndDelete(code).exec();
    if (!companybasic) {
        return res.status(404).json('companybasic not found');
    }
  // clean refs
  // db.collections.updateMany

  await Contactbasic.updateMany(
    { companybasics: companybasic._id },
    {
      $pull: {
        companybasics: companybasic._id
      }
    }
  ).exec();

    return res.status(204).json(companybasic);
};

async function addContactbasic (req, res){
  const {code, id} = req.params;
  const companybasic = await Companybasic.findById(code).select('contactbasics').exec();
  const contactbasic = await Contactbasic.findById(id).select('companybasics').exec();

  if (!contactbasic||!companybasic){
    return res.status(404).json('contactbasic or companybasic not exist');
  }
  companybasic.contactbasics.addToSet(contactbasic._id);
  contactbasic.companybasics.addToSet(companybasic._id);

  await companybasic.save();
  await contactbasic.save();
  return res.json(companybasic);
};

async function removeContactbasic (req, res){
  const {code, id} = req.params;
  //find companybasic,contactbasic
  const companybasic = await Companybasic.findById(code).select('contactbasics').exec();
  const contactbasic = await Contactbasic.findById(id).select('companybasics').exec();
 //check whether contactbasic/companybasic exist
  if (!contactbasic||!companybasic) {
    return res.status(404).json('contactbasic or companybasic not exist');
  }
      //clean refs
      companybasic.contactbasics.pull(contactbasic._id);
      contactbasic.companybasics.pull(companybasic._id);
      

  await companybasic.save();
  await contactbasic.save();
  return res.status(204).json(companybasic);
  //return res.sendStatus(204);
}

module.exports = {
    addCompanybasic,
    getCompanybasic,
    getAllCompanybasics,
    updateCompanybasic,
    deleteCompanybasic,
    addContactbasic,
    removeContactbasic
}