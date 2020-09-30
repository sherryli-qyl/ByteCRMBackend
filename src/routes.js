const express = require('express');

const contactbasicRoute = require('./routes/contactbasics');
const companybasicRoute = require('./routes/companybasics');
const companylistRoute = require('./routes/companylists');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const noteRoute = require('./routes/notes');

const authGuard = require('./middleware/authGuard');

const router = express.Router();

router.use('/contactbasics', authGuard, contactbasicRoute);
router.use('/companybasics', authGuard, companybasicRoute);
router.use('/companylists', authGuard, companylistRoute);
router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/notes', noteRoute);

module.exports = router;
