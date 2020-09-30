const Contactbasic = require('../models/contactbasic'); 
const Companybasic = require('../models/companybasic'); 


async function addContactbasic(req, res){
    const {firstName, lastName, email}= req.body;
    const contactbasic = new Contactbasic ({
        firstName,
        lastName,
        email
    });

   await contactbasic.save();
    
   return res.json(contactbasic);
}

async function getContactbasic(req, res){
    const {id} =req.params;
    const contactbasic = await Contactbasic.findById(id)
    .populate('companybasics', 'code name')
    .exec();
    if (!contactbasic) {
        return res.status(404).json('contactbasic not found');
    }
    return res.json(contactbasic); 
}

// api/Contactbasics?fields=courses;
async function getAllContactbasics(req, res){
    const {page=1, pageSize=10, q='', fields} = req.query; //per_page or camelCase
    // const limit = Number(pageSize) ||10
    //fields = courses
    //[courses]
    //` +courses`
    const limit = Math.max(pageSize * 1, 10);
    const skip = (Math.max(page * 1, 1) - 1) * limit;
    const contactbasics = await Contactbasic.find().limit(limit).skip(skip).exec();
    // Contactbasic.find({$or:[{firstName: {$regex: q}},{lastName: {$regex:q}}]})
    // new RegExp(req.query.q);
    // Contactbasic.find().select(select)
    return res.json(contactbasics);
    // return res.json({ data: contactbasics, pagination: totalCount });
}

async function updateContactbasic(req, res){
    const {id} =req.params;
    const {firstName, lastName, email} = req.body;
    const newContactbasic = await Contactbasic.findByIdAndUpdate(
       id,
        {firstName, lastName, email},
        {new : true}
    ).exec();
    if(!newContactbasic){
        return res.status(404).json('contactbasic not found');
    }
    return res.status(202).json(newContactbasic);
}

async function deleteContactbasic(req, res){
    const {id} = req.params;
    const contactbasic = await Contactbasic.findByIdAndDelete(id).exec();
    if (!contactbasic){
        return res.status(404).json('contactbasic not found');
    } 
    await Companybasic.updateMany(
        { _id: { $in: contactbasic.companybasics } }, //{ contactbasics: contactbasic._id },
        {
          $pull: {
            contactbasics: contactbasic._id
          }
        }
      ).exec();
    return res.status(200).json(contactbasic);
};

async function addCompanybasic(req, res){
const {id, code} = req.params;
const contactbasic = await Contactbasic.findById(id).select('companybasics').exec();
const companybasic = await Companybasic.findById(code).select('contactbasics').exec();

if (!contactbasic||!companybasic) {
    return res.status(404).json('contactbasic or companybasic not exist');
}
contactbasic.companybasics.addToSet(companybasic._id);
companybasic.contactbasics.addToSet(contactbasic._id);

await contactbasic.save();
await companybasic.save();
return res.json(contactbasic);
};
//get contactbasic id, get companybasic code
//find companybasic
    //find contactbasic
    //check contactbasic or companybasic whether exist
//add companybasic to contactbasic
//the same contactbasic should not add companybasic twice

//TODO: add contactbasic to companybasic
//the same companybasic should not add contactbasic twice


//save contactbasic and companybasic

//return saved contactbasic



async function removeCompanybasic(req, res){
    const {id, code} = req.params;
// find companybasic,contactbasic
    const contactbasic = await Contactbasic.findById(id).select('companybasics').exec();
    const companybasic = await Companybasic.findById(code).select('contactbasics').exec();
//check companybasic/contactbasic whether exist

if (!contactbasic||!companybasic) {
    return res.status(404).json('contactbasic or companybasic not exist');
  }
      //clean refs
      companybasic.contactbasics.pull(contactbasic._id);
      contactbasic.companybasics.pull(companybasic._id);

  await companybasic.save();
  await contactbasic.save();
  return res.status(200).json(contactbasic);
 // return res.sendStatus(200);
}

module.exports = {
    addContactbasic,
    getContactbasic,
    getAllContactbasics,
    updateContactbasic,
    deleteContactbasic,
    addCompanybasic,
    removeCompanybasic
}