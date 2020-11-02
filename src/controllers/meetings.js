const Meeting = require('../models/meeting');
const Contact = require('../models/contact');
const {checkDuplicateItem} = require('../utils/sortArray');

async function addMeeting(req, res) { 
	const { description,type,title,user,contacts,date,time,duration,outcome} = req.body;
	const meeting = new Meeting({
		title,
		user,
		contacts,
		date,
		time,
		description,
		type,
        duration,
        outcome,
		
	});
    await meeting.save();
    const resMeeting = await Meeting.findOne({ _id: meeting._id })
        .populate('contacts', 'firstName lastName email')
        .populate('user', 'firstName lastName fullName')
        .exec();
    return res.json(resMeeting);
	//return res.json(meeting);
}

async function getAllMeetings(req, res) { 
	const meetings = await Meeting.find().exec();
	return res.json(meetings);
}

async function getMeetings(req, res) { 
	const id =req.params.id;
    const meetings = await Meeting.find()
    .exec();
	const matchedmeetings = [];
	
 	for(let i in meetings){
		 if(meetings[i].contacts.includes(id))
		  {
            const infomeeting = await Meeting.findById(meetings[i]._id)
            .populate('contacts', 'firstName lastName email')
            .populate('user', 'firstName lastName fullName')
            .exec();
			matchedmeetings.push(infomeeting);
			}
	 }	 
	 return res.status(200).json(matchedmeetings);	
}

async function getMeetingsByMultiContacts(req, res){
    const { ids } = req.params;
    const contactsId = ids.split("&&");
    const matchedmeetings = [];
    const meetings = await Meeting.find();
    for (i in contactsId) {
        for(let j in meetings){
            if(meetings[j].contacts.includes(contactsId[i]))
             {
               const infomeeting = await Meeting.findById(meetings[j]._id)
               .populate('contacts', 'firstName lastName email')
               .populate('user', 'firstName lastName fullName')
               .exec();
               matchedmeetings.push(infomeeting);
               }
        }	 
        
    }
    matchedmeetings = checkDuplicateItem(matchedmeetings);
    return res.status(200).json(matchedmeetings);
}

async function updateMeeting(req, res) {
    const { id } = req.params;
    const {date,time,duration,description,outcome} = req.body;
    const newMeeting = await Meeting.findByIdAndUpdate(
        id,
        {date,time,duration,description,outcome},{new: true}
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
    getMeetingsByMultiContacts,
}