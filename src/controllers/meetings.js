const Meeting = require('../models/meeting');

async function addMeeting(req, res) { 
	const { description,type,title, organizer,attendees,date,time,duration} = req.body;
	const meeting = new Meeting({
		title,
		organizer,
		attendees,
		date,
		time,
		description,
		type,
		duration,
		
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

async function updateMeeting(req, res) {
    const { id } = req.params;
    const {date,time,duration,description} = req.body;
    const newMeeting = await Meeting.findByIdAndUpdate(
        id,
        {date,time,duration,description},{new: true}
    ).exec();
    if (!newMeeting) {
        return res.status(404).json('meeting not found');
    }
    return res.json(newMeeting);
}

module.exports = {
	addMeeting,
	getAllMeetings,
	getMeetings,
	updateMeeting
}