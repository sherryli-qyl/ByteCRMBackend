const express = require('express');

const router = express.Router();

const {addContact, getContact, getAllContacts, updateContact, deleteContact} = require('../controllers/contacts');

router.get('/', getAllContacts);
router.get('/:id', getContact);
router.post('/', addContact);
router.put('/:id',updateContact);
router.delete('/:id', deleteContact); 



module.exports = router;