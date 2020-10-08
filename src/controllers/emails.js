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
    const emails = await Email.find({contacts:id}).populate('contacts','firstName lastName email').exec();
    return res.status(200).json(emails);
}

async function updateEmail(req, res) {
    const { id } = req.params;
    const {date,time,description} = req.body;
    const newEmail = await Email.findByIdAndUpdate(
        id,
        {date,time,description},
    ).exec();
    if (!newEmail) {
        return res.status(404).json('email not found');
    }
    return res.status(202).json(newEmail);
}


async function addContacts(contactId,emailId) {
    const contact = await Contact.findById(contactId).exec();
    if (!contact) {
        return res.status(404).json('contacts not exist');
    }
    contact.emailLogs.addToSet(emailId);
    await contact.save();
};

async function updateContacts(req,res) {
    const {contactId,emailId} = req.params;
    const contact = await Contact.findById(contactId).exec();
    const email = await Email.findById(emailId).exec();
    if (!contact || !email) {
        return res.status(404).json('contacts or email not exist');
    }
    contact.emailLogs.addToSet(emailId);
    email.contacts.addToSet(contactId);
    await contact.save();
    await email.save();
    return res.status(200).json(contact);
};


async function removeContacts(req,res) {  
    const {contactId,emailId} = req.params;
    const contact = await Contact.findById(contactId).exec();
    const email = await Email.findById(emailId).exec();
    if (!contact || !email) {
        const errorMeesage = res.status(404).json('contact or email not exist');
        return errorMeesage;
    }
    contact.emailLogs.pull(emailId);
    email.contacts.pull(contactId);
    await contact.save();
    await email.save();
    return res.status(200).json(contact);
}




module.exports = {
    logEmail,
    getAllEmailLogs,
    updateEmail,
    updateContacts,
    removeContacts,
    getEmailsByContactId,
}