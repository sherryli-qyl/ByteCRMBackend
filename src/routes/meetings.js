const express = require('express');

const { 
	addMeeting,
	getAllMeetings,
	getMeetings,
	updateMeeting
} = require('../controllers/meetings');

const router = express.Router();


router.post('/', addMeeting);
router.get('/', getAllMeetings);
router.get('/:id',getMeetings);
router.put('/:id',updateMeeting);

module.exports = router;
