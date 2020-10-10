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
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },

      content: {
        type: String,
        required: true,
      },

      isDeleted: {
        type: Boolean,
        default: false,
      },
      
      required: false,
    },
    {
      timestamps: true
    }],

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