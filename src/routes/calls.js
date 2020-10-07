const express = require('express');

const {
  getAllCalls,
  addCall,
  getCall,
  updateCall,
  deleteCall,
} = require('../controllers/calls');

const router = express.Router();

router.get('/', getAllCalls);
router.post('/', addCall);
router.get('/:id', getCall);
router.put('/:id', updateCall);
router.delete('/:id', deleteCall);

module.exports = router;
