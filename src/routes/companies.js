const express = require('express');

const router = express.Router();

const {addCompany, getCompany, getAllCompanies, updateCompany, deleteCompany} = require('../controllers/Companies');//导入功能

router.get('/', getAllCompanies);
router.get('/:id', getCompany);
router.post('/', addCompany);
router.put('/:id',updateCompany);
router.delete('/:id', deleteCompany); 



module.exports = router;