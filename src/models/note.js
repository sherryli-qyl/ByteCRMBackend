const mongoose = require('mongoose');

const schema = new mongoose.Schema(
 	{
		// relatedTo: {
		// 	contacts and/or companies
		// },

		content: {
			type: String,
			required: true
		},

		author: {
			//createdBy - user
			type: String,
			required: true
		},

		// lastModifiedBy: {
		// ref: user
		// },


		comments: [{
			author: String, //createdBy: ref user
			content: String,
			//timestamps
		}],

		// tasks:[{
		// 	ref: task
		// }],

		__v: {
			type: Number,
			select: false
		}
	},
	{
		timestamps: true
	}
);

const Model = mongoose.model('Note', schema);

module.exports = Model;