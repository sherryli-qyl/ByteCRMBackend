const Contact = require('../models/contact'); 
const Company = require('../models/company'); 


async function addContact(req, res){
    const {firstName, lastName, email,jobTitle,phoneNo,lifeCycle}= req.body;
    const contact = new Contact ({
        firstName,
        lastName,
        email,
        jobTitle,
        phoneNo,
        lifeCycle,
    });
   await contact.save();
   return res.json(contact);
}

async function getContact(req, res){
    const {id} =req.params;
    console.log("your id is " + id);
    const contact = await Contact.findById(id)
    .populate('companies', 'code name')
    .exec();
    if (!contact) {
        return res.status(404).json('contact not found');
    }
    return res.status(200).json(contact); 
}

// api/Contacts?fields=courses;
async function getAllContacts(req, res){
    const {page=1, pageSize=10, q='', fields} = req.query; //per_page or camelCase
    // const limit = Number(pageSize) ||10
    //fields = courses
    //[courses]
    //` +courses`
    const limit = Math.max(pageSize * 1, 10);
    const skip = (Math.max(page * 1, 1) - 1) * limit;
    const contacts = await Contact.find().limit(limit).skip(skip).exec();
    // Contact.find({$or:[{firstName: {$regex: q}},{lastName: {$regex:q}}]})
    // new RegExp(req.query.q);
    // Contact.find().select(select)
    return res.status(200).json(contacts); 
}

async function updateContact(req, res){
    const {id} =req.params;
    console.log("your id is " + id);
    const {firstName,lastName,phoneNo,lifeCycle,jobTitle} = req.body;
    const newContact = await Contact.findByIdAndUpdate(
       id,
        {firstName,lastName,phoneNo,lifeCycle,jobTitle},
    ).exec();
    if(!newContact){
        return res.status(404).json('contact not found');
    }
    return res.status(202).json(newContact);
}

async function deleteContact(req, res){
    const {id} = req.params;
    const contact = await Contact.findByIdAndDelete(id).exec();
    if (!contact){
        return res.status(404).json('contact not found');
    } 
    await Company.updateMany(
        { _id: { $in: contact.companies } }, //{ contacts: contact._id },
        {
          $pull: {
            contacts: contact._id
          }
        }
      ).exec();
    return res.status(200).json(contact);
};

async function addCompany(req, res){
const {id, code} = req.params;
const contact = await Contact.findById(id).select('companies').exec();
const company = await Company.findById(code).select('contacts').exec();

if (!contact||!company) {
    return res.status(404).json('contact or company not exist');
}
contact.companies.addToSet(company._id);
company.contacts.addToSet(contact._id);

await contact.save();
await company.save();
return res.json(contact);
};
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



async function removeCompany(req, res){
    const {id, code} = req.params;
// find company,contact
    const contact = await Contact.findById(id).select('companies').exec();
    const company = await Company.findById(code).select('contacts').exec();
//check company/contact whether exist

if (!contact||!company) {
    return res.status(404).json('contact or company not exist');
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
    getContact,
    getAllContacts,
    updateContact,
    deleteContact,
    addCompany,
    removeCompany
}