const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
		},

		contact: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Contact',
		},

		value: {
			type: String,
			required: false,
		},

		description: {
			type: String,
			required: true,
		},

		time: {
			type: String,
			required: true,
		},

		date: {
			type: String,
			required: true,
		},

		taskType: {
			type: String,
			required: true,
		},

		priority: {
			type: String,
			required: true,
		},

		users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

		createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },


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