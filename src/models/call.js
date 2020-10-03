const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },

    author: {
      type: String,
      required: true,
    },

    contact: {
      type: String,
      required: true,
    },

    outcome: {
      type: String,
      required: true,
    },

    __v: {
      type: Number,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const Model = mongoose.model('Call', schema);

module.exports = Model;
