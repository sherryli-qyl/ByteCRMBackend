const mongoose = require('mongoose');

const schema = new mongoose.Schema(
 	{
	  	content: {
			type: String,
			required: true
    },
    
    author: {
			//createdBy - user
			type: String,
			required: true
		},


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