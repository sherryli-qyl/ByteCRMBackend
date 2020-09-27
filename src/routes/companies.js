const express = require('express');

const router = express.Router();

const {addCompany, 
       getCompany, 
       getAllCompanies, 
       updateCompany, 
       deleteCompany,
       addContact,
       removeContact
    } = require('../controllers/Companies');//导入功能

router.get('/', getAllCompanies);
router.get('/:code', getCompany);
router.post('/', addCompany);
router.put('/:code',updateCompany);
router.delete('/:code', deleteCompany); 

router.post('/:code/contacts/:id', addContact);
router.delete('/:code/contacts/:id', removeContact);


module.exports = router;