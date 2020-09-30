const express = require('express');


const {
       addCompanybasic, 
       getCompanybasic, 
       getAllCompanybasics, 
       updateCompanybasic, 
       deleteCompanybasic,
       addContactbasic,
       removeContactbasic
    } = require('../controllers/companybasics');//导入功能

const router = express.Router();

router.get('/', getAllCompanybasics);
router.get('/:code', getCompanybasic);
router.post('/', addCompanybasic);
router.put('/:code',updateCompanybasic);
router.delete('/:code', deleteCompanybasic); 

router.post('/:code/contactbasics/:id', addContactbasic);
router.delete('/:code/contactbasics/:id', removeContactbasic);


module.exports = router;