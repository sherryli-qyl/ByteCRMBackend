const mongoose = require('mongoose');

const schema = new mongoose.Schema(
 	{
		type: {
      type: String,
			required: true,
		},
		
		relatedTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Contact',
		},

    value:{
			type: String,
			required:false,
		},
		
		description:{
			type: String,
			required:true,
		},
		
		time: {
			type: String,
			required: true,
		},

		date: {
			type: String,
			required: true,
		},

		typeTask: {
      type: String,
			required: true,
    },

		priority: {
			type: String,
			required:true,
		},

		assignedTo: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],

		createdBy:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
     
    //user:{type:  mongoose.Schema.Types.ObjectId, ref: 'User'},
        
    

		__v: {
			type: Number,
			select: false
		}
	},
	{
		timestamps: true
	}
);

const Model = mongoose.model('Task', schema);

module.exports = Model;