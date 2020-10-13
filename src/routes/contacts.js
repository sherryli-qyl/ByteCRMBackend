const express = require('express');

const { 
    addContact,
    getContact,
    getAllContacts,
    updateContact,
    deleteContact,
    addCompany,
    updateUser,
    searchContactByUserId,
    removeCompany
} = require('../controllers/contacts');

const router = express.Router();

router.get('/', getAllContacts);
router.get('/:id', getContact);
router.get('/search/:userId/:keywords',searchContactByUserId);
router.post('/', addContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);
router.put('/:contactId/users/:userId', updateUser);
router.post('/:id/companies/:code', addCompany);
router.delete('/:id/companies/:code', removeCompany);

module.exports = router;