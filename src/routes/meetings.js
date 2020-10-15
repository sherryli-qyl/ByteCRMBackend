const express = require('express');

const { 
	addMeeting,
	getAllMeetings,
	getMeetings
} = require('../controllers/meetings');

const router = express.Router();


router.post('/', addMeeting);
router.get('/', getAllMeetings);
router.get('/:id',getMeetings);

module.exports = router;
