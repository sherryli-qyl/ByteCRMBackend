const express = require('express');
const {
       addCompanylist, 
       getCompanylist, 
       getAllCompanylists, 
       updateCompanylist, 
       deleteCompanylist
    } = require('../controllers/companylists');//导入功能

const router = express.Router();

router.get('/', getAllCompanylists);
router.get('/:code', getCompanylist);
router.post('/', addCompanylist);
router.put('/:code',updateCompanylist);
router.delete('/:code', deleteCompanylist); 

module.exports = router;