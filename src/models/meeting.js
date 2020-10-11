const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
 	{
		type: {
			type: String,
			required: true,
		  },

		description:{
			type: String,
			required:true,
		},
		title: {
			type: String,
			required: true
		},
		
        
        organizer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
	

        attendees: 
        [
            { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
            }
        ],
	
		date:{
			type: String,
			required: true
		},

		time:{
			type: String,
			required: true
		},
		__v: {
			type: Number,
			select: false
		},
	});

const Model = mongoose.model('Meeting', meetingSchema);

module.exports = Model;