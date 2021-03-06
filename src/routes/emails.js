const express = require('express');

const {
    logEmail,
    getAllEmailLogs, 
    getEmailsByContactId,
    getEmailsByMultiContacts,
    updateContacts,
    updateEmail,
    deleteEmail,
    removeContacts,
} = require('../controllers/emails');

const router = express.Router();

router.get('/',  getAllEmailLogs);
router.get('/:id', getEmailsByContactId);
router.get('/contacts/:ids',getEmailsByMultiContacts);
router.post('/', logEmail);
router.put('/:id',updateEmail);
router.put('/:emailId/contacts/:contactId', updateContacts);
router.delete('/:id', deleteEmail);
router.delete('/:emailId/contacts/:contactId', removeContacts);

module.exports = router;
