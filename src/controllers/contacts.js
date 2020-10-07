const Contact = require('../models/contact');
const Company = require('../models/company');


async function addContact(req, res) {
    const { firstName, lastName, email, jobTitle, phoneNo, lifeCycle,contactOwner } = req.body;
    const contact = new Contact({
        firstName,
        lastName,
        contactOwner,
        email,
        jobTitle,
        phoneNo,
        lifeCycle,
    });
    await contact.save();
    return res.json(contact);
}

async function getContact(req, res) {
    const { id } = req.params;
    const contact = await Contact.findById(id).populate('company','name').exec();
    if (!contact) {
        return res.status(404).json('contact not found');
    }
    return res.status(200).json(contact);
}

// api/Contacts?fields=courses;
async function getAllContacts(req, res) {
    const { page = 1, pageSize = 10, q = '', fields } = req.query;
    const limit = Math.max(pageSize * 1, 10);
    const skip = (Math.max(page * 1, 1) - 1) * limit;
    const contacts = await Contact.find().limit(limit).skip(skip).exec();
    return res.status(200).json(contacts);
}

async function updateContact(req, res) {
    const { id } = req.params;
    const { firstName, lastName, phoneNo, lifeCycle, jobTitle,contactOwner} = req.body;
    const newContact = await Contact.findByIdAndUpdate(
        id,
        { firstName, lastName, phoneNo, lifeCycle, jobTitle, contactOwner},
    ).exec();
    if (!newContact) {
        return res.status(404).json('contact not found');
    }
    return res.status(202).json(newContact);
}

async function deleteContact(req, res) {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id).exec();
    if (!contact) {
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

async function addCompany(req, res) {
    const { id, code } = req.params;
    const contact = await Contact.findById(id).exec();
    const company = await Company.findById(code).exec();

    if (!contact || !company) {
        return res.status(404).json('contact or company not exist');
    }
    contact.company = company;
    company.contacts.addToSet(contact._id);

    await contact.save();
    await company.save();
    return res.json(contact);
};


async function removeCompany(req, res) {
    const { id, code } = req.params;
    const contact = await Contact.findById(id).exec();
    const company = await Company.findById(code).exec();

    if (!contact || !company) {
        return res.status(404).json('contact or company not exist');
    }

    company.contacts.pull(contact._id);
    contact.company = "";

    await company.save();
    await contact.save();
    return res.status(200).json(contact);

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