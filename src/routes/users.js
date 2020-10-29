const express = require('express');
const { 
    addUser,
    searchUser,
    addRelatedUser
 } = require('../controllers/users');

const router = express.Router();

router.post('/', addUser);
router.get('/search/:id/:keywords', searchUser);
router.put('/relation/:id/:relatedId',addRelatedUser);

module.exports = router;
