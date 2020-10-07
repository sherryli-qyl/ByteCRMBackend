const Contact = require('../models/contact');
const User = require('../models/user');
const Email = require('../models/email');


async function logEmail(req, res) {
    const { contacts,date,time,description,type,user } = req.body;
    const email = new Email({
        description,
        date,
        time,
        type,
        user,
    });
    for (let i in contacts){
        addContacts(contacts[i],email._id);
        email.contacts.addToSet(contacts[i]);
    }
    await email.save();
    return res.json(email);
}

async function getAllEmailLogs(req, res) {
    const { page = 1, pageSize = 10, q = '', fields } = req.query;
    const limit = Math.max(pageSize * 1, 10);
    const skip = (Math.max(page * 1, 1) - 1) * limit;
    const emails = await Email.find().limit(limit).skip(skip).exec();
    return res.status(200).json(emails);
}

async function getEmailsByContactId(req, res) {
    const { id } = req.params;
    const emails = await Contact.findById(id).populate('emailLogs').exec();
    return res.status(200).json(emails);
}



async function addContacts(contactId,emailId) {
    const contact = await Contact.findById(contactId).exec();
    if (!contact) {
        return res.status(404).json('contacts not exist');
    }
    contact.emailLogs.addToSet(emailId);
    await contact.save().then((id)=>(
         console.log(contactId)
    ));
};

async function removeContacts(req,res) {  
    const {contactId,emailId} = req.params;
    const contact = await Contact.findById(contactId).exec();
    if (!contact) {
        const errorMeesage = res.status(404).json('contact not exist');
        return errorMeesage;
    }
    contact.emailLogs.pull(emailId);
    await contact.save();
    return res.status(200).json(contact);
}




module.exports = {
    logEmail,
    getAllEmailLogs,
    removeContacts,
    getEmailsByContactId,
}