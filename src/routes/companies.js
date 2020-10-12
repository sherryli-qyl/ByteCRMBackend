const express = require('express');


const {
       addCompany, 
       getCompanyByCode, 
       getAllCompanies, 
       updateCompany, 
       deleteCompany,
       addContact,
       removeContact
    } = require('../controllers/companies');//导入功能

const router = express.Router();

router.get('/', getAllCompanies);
router.get('/:code', getCompanyByCode);
router.post('/', addCompany);
router.put('/:code',updateCompany);
router.delete('/:code', deleteCompany); 

router.post('/:code/contacts/:id', addContact);
router.delete('/:code/contacts/:id', removeContact);


module.exports = router;