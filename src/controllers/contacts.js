const Contact = require('../models/contact'); 

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
    const contact = await Contact.findById(id).exec();
    if (!contact) {
        return res.status(404).json('contact not found');
    }
    return res.status(202).json(contact); 
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
    const contact = await (await Contact.findByIdAndDelete(id)).execPopulate();
    if (!contact){
        return res.status(404).json('contact not found')
    } 
    return res.status(200).json(contact);
}

module.exports = {
    addContact,
    getContact,
    getAllContacts,
    updateContact,
    deleteContact
}