const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: 'Note',
    },

    relatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'onModel'
    },

    onModel: {
      type: String,
      enum: ['Contact', 'Company']
    },

    content: {
      type: String,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    comments: [{
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    timestamps: true,
    toJSON: { 
      virtuals: true 
    }
  }
);

schema.virtual('date').get(function () {
  const timestamp = this.createdAt;
  const year = timestamp.getFullYear();
  const month = timestamp.getMonth() + 1;
  const date = timestamp.getDate();
  return (year + '-' + month + '-' + date);
});

schema.virtual('time').get(function () {
  const timestamp = this.createdAt;
  const hours = timestamp.getHours() < 10 ? "0" + timestamp.getHours() : timestamp.getHours();;
  const minutes = timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes() : timestamp.getMinutes();
  
  return (hours + ':' + minutes);
});

const Model = mongoose.model('Note', schema);

module.exports = Model;