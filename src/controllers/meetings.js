const Meeting = require('../models/meeting');
const Contact = require('../models/contact');

async function addMeeting(req, res) { 
	const { description,type,title,user,contacts,date,time,duration} = req.body;
	const meeting = new Meeting({
		title,
		user,
		contacts,
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
	const matchedmeetings = [];
	
 	for(let i in meetings){
		 if(meetings[i].contacts.includes(id))
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

async function deleteMeeting(req, res) {
    const {id} = req.params;
    const meeting = await Meeting.findByIdAndDelete(id).exec();
    if (!meeting) {
	console.log("note");
	  return res.status(404).json('meeting not found');
	  
	}	
	/*
    await Contact.updateMany(
      { emailLogs: email._id },
      {
        $pull: {
            emailLogs: email._id 
        }
      }
    ).exec();*/
    return res.sendStatus(204);
  }


async function updateContacts(req, res) {
    const { contactId, meetingId } = req.params;
    const contact = await Contact.findById(contactId).exec();
    const meeting = await Meeting.findById(meetingId).exec();
    if (!contact || !meeting) {
        return res.status(404).json('contacts or meeting not exist');
    }
    //contact.emailLogs.addToSet(emailId);
    meeting.contacts.addToSet(contactId);
    //await contact.save();
    await meeting.save();
    return res.status(200).json(meeting);
};

async function removeContacts(req, res) {
    const { contactId, meetingId } = req.params;
    const contact = await Contact.findById(contactId).exec();
    const meeting = await Meeting.findById(meetingId).exec();
    if (!contact || !meeting) {
        const errorMeesage = res.status(404).json('contact or meeting not exist');
        return errorMeesage;
    }
    //contact.emailLogs.pull(emailId);
    meeting.contacts.pull(contactId);
    if (meeting.contacts.length === 0) {
        await meeting.findByIdAndDelete(meeting._id);
        //await contact.save();
        return res.status(200).json("meeting has been deleted");

    }
    else {
        await meeting.save();
        //await contact.save();
        return res.status(200).json(contact);
    }
}




module.exports = {
	addMeeting,
	getAllMeetings,
	getMeetings,
	updateMeeting,
	deleteMeeting,
	updateContacts,
	removeContacts,
}