const express = require('express');

const contactRoute = require('./routes/contacts');
const companyRoute = require('./routes/companies');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const noteRoute = require('./routes/notes');
const callRoute = require('./routes/calls');
const taskRoute = require('./routes/tasks');
const emailRoute = require('./routes/emails');
const meetingRoute = require('./routes/meetings');

const authGuard = require('./middleware/authGuard');

const router = express.Router();

router.use('/contacts',contactRoute);
router.use('/companies',companyRoute);
// router.use('/contacts',authGuard,contactRoute);
// router.use('/companies',authGuard,companyRoute);
router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/notes', noteRoute);
router.use('/calls', callRoute);
router.use('/tasks', taskRoute);
router.use('/emails',emailRoute);
router.use('/meetings',meetingRoute);
module.exports = router;
