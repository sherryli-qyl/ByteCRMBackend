const express = require('express');

const { 
    addContactbasic,
    getContactbasic,
    getAllContactbasics,
    updateContactbasic,
    deleteContactbasic,
    addCompanybasic,
    removeCompanybasic
} = require('../controllers/contactbasics');

const router = express.Router();

router.get('/', getAllContactbasics);
router.get('/:id', getContactbasic);
router.post('/', addContactbasic);
router.put('/:id', updateContactbasic);
router.delete('/:id', deleteContactbasic);

router.post('/:id/companybasics/:code', addCompanybasic);
router.delete('/:id/companybasics/:code', removeCompanybasic);

module.exports = router;