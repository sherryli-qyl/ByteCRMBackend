const Contact = require('../models/contact'); 
const Company = require('../models/company'); 


async function addContact(req, res){
    const {firstName, lastName, email}= req.body;
    const contact = new Contact ({
        firstName,
        lastName,
        email
    });

   await contact.save();
    
    return res.json(contact);
}

async function getContact(req, res){
    const {id} =req.params;
    const contact = await Contact.findById(id)
    .populate('companies')
    .exec();
    if (!contact) {
        return res.status(404).json('contact not found');
    }
    return res.json(contact); 
}

async function getAllContacts(req, res){
    const contacts= await Contact.find().exec();
    return res.json(contacts);
}

async function updateContact(req, res){
    const {id} =req.params;
    const {firstName, lastName, email} = req.body;
    const newContact = await Contact.findByIdAndUpdate(
       id,
        {firstName, lastName, email},
        {new : true}
    );
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
    return res.status(200).json(contact);
};

async function addCompany(req, res){
const {id, code} = req.params;
const contact = await Contact.findById(id).exec();
const company = await Company.findById(code).exec();

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
    const contact = await Contact.findById(id).exec();
    const company = await Company.findById(code).exec();
//check company/contact whether exist
if (!contact || !company) {
    return res.status(404).json('contact or company not exist');
}

await Company.updateMany(
    {_id: {$in: contact.companies}} ,// {contacts: contact._id},
    {
        $pull: {
            contacts: contact._id
    }
}
).exec()
//if (contact.company.map(i => i.toString()).includes(company._id))
//Todo:remove contact from company
await contact.save();
return res.status(200);
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