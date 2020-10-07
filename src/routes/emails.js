const express = require('express');

const {
    logEmail,
    getAllEmailLogs, 
    getEmailsByContactId,
    removeContacts,
} = require('../controllers/emails');

const router = express.Router();

router.get('/',  getAllEmailLogs);
router.get('/:id', getEmailsByContactId);
router.post('/', logEmail);
// router.put('/:id', updateEmail);
// router.delete('/:id', deleteEmail);
router.delete('/:emailId/contacts/:contactId', removeContacts);

module.exports = router;
