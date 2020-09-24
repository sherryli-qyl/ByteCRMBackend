const express = require('express');

const router = express.Router();

const contactRoute = require('./routes/contacts.js');

const companyRoute = require('./routes/companies.js');


router.use('/contacts',contactRoute);
router.use('/companies', companyRoute);

module.exports = router;
