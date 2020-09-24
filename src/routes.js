const express = require('express');

const router = express.Router();

const contactRoute = require('./routes/contacts.js');

const companyRoute = require('./routes/companies.js');

const userRoute = require('./routes/users');

const authRoute = require('./routes/auth');

router.use('/contacts', contactRoute);
router.use('/companies', companyRoute);
router.use('/users', userRoute);
router.use('/auth', authRoute);

module.exports = router;
