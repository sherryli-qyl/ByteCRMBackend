const express = require('express');
const { 
    addUser,
    searchUser
 } = require('../controllers/users');

const router = express.Router();

router.post('/', addUser);
router.get('/serach/:keyword', searchUser);

module.exports = router;
