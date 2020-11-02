const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema(
 	{
		type: {
			type: String,
			required: true,
		  },


		title: {
			type: String,
			required: true
		},
		outcome: {
			type: String,
			required: true
		},

		description:{
			type: String,
			required:true,
		},
		
		user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	

        contacts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
	
		date: {
			type: String,
			required: true,
		},
		duration: {
			type: String,
			required: true,
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