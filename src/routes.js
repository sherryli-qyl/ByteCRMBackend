const express = require('express');

const contactRoute = require('./routes/contacts');
const companyRoute = require('./routes/companies');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const noteRoute = require('./routes/notes');

const authGuard = require('./middleware/authGuard');

const router = express.Router();

router.use('/contacts', authGuard,contactRoute);
router.use('/companies', authGuard,companyRoute);
router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/notes', noteRoute);

module.exports = router;
