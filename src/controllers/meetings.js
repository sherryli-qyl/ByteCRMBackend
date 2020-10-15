const Meeting = require('../models/meeting');

async function addMeeting(req, res) { 
	const { description,type,title, organizer,attendees,date,time} = req.body;
	const meeting = new Meeting({
		title,
		organizer,
		attendees,
		date,
		time,
		description,
		type,
		
	});
	await meeting.save();
	return res.json(meeting);
}

async function getAllMeetings(req, res) { 
	const meetings = await Meeting.find().exec();
	return res.json(meetings);
}

async function getMeetings(req, res) { 
	const id =req.params.id;
	const meetings = await Meeting.find().exec();
	//let matchedmeetings = [];
	const matchedmeetings = [];
	
 	for(let i in meetings){
		 if(meetings[i].attendees.includes(id))
		  {
			matchedmeetings.push(meetings[i]);
			}
	 }


	 
	 return res.status(200).json(matchedmeetings);
	
}

module.exports = {
	addMeeting,
	getAllMeetings,
	getMeetings
}