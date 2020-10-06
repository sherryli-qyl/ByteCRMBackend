const mongoose = require("mongoose");
const Joi = require("joi");

const schema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      // select: false,
    },
    lastName: {
      type: String,
      required: false,
      // select: false,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    contactOwner: {
      type: String,
      required: false,
    },
    lastActivityDate: {
      type: Date,
      required: false,
    },
    createDate: {
      type: Date,
      required: false,
    },
    leadStatus: {
      type: String,
      required: false,
    },
    company: { type: String, ref: "Company" },
    jobTitle: {
      type: String,
      required: false
    },
    lifeCycle: {
      type: String,
      required: false,
    },
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    toJSON: {
      timestamps: true,
    },
  }
);

// schema.virtual("name").get(function () {
//   return this.firstName + " " + this.lastName;
// });

const model = mongoose.model("Contact", schema);
module.exports = model;
