const mongoose = require('mongoose');

const schema = new mongoose.Schema(
 	{
		type: {
      type: String,
      default: 'note',
    },

    relatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
    },

		content: {
			type: String,
			required: true
		},

		author: {
			//createdBy - user
			type: String,
			required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    lastUpdatedAt: {
      type: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    comments: [{
			author: String, //createdBy: ref user
			content: String,
			//timestamps
    }],

    // comments: [{
    //   // commentId:
    //   // createdAt:
    //   // updatedAt:
    //   createdBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    //   },

    //   createdAt: {  
    //     type: Date,
    //   },

    //   lastModifiedAt: {
    //     type: Date,
    //   },

    //   lastModifiedBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    //   },

    //   content: {
    //     type: String,
    //   },

    //   isDeleted: {
    //     type: Boolean,
    //     default: false,
    //   }
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