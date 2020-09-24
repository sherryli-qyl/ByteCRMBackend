const express = require('express');

const router = express.Router();

const {addContact, 
       getContact, 
       getAllContacts, 
       updateContact, 
       deleteContact,
       addCompany,
       removeCompany
    } = require('../controllers/contacts');

router.get('/', getAllContacts);
router.get('/:id', getContact);
router.post('/', addContact);
router.put('/:id',updateContact);
router.delete('/:id', deleteContact); 

router.post('/:id/companies/:code',addCompany);
router.delete('/:id/companies/:code',removeCompany);

module.exports = router;