const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema(
  {   
    type: {
      type: String,
      required: true,
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

    contacts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
       

    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
   
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const Model = mongoose.model('Email', emailSchema);

module.exports = Model;
