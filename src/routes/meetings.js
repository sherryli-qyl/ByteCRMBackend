const express = require('express');

const { 
	addMeeting,
	getAllMeetings,
	getMeetings,
	updateMeeting,
	deleteMeeting
} = require('../controllers/meetings');

const router = express.Router();


router.post('/', addMeeting);
router.get('/', getAllMeetings);
router.get('/:id',getMeetings);
router.put('/:id',updateMeeting);
router.delete('/:id',deleteMeeting);

module.exports = router;
