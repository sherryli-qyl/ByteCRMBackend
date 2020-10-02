const express = require('express');

const { 
    addContact,
    getContact,
    getAllContacts,
    updateContact,
    deleteContact,
    addCompany,
    removeCompany
} = require('../controllers/contacts');

const router = express.Router();

router.get('/', getAllContacts);
router.get('/:id', getContact);
router.post('/', addContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

router.post('/:id/companies/:code', addCompany);
router.delete('/:id/companies/:code', removeCompany);

module.exports = router;