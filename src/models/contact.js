const mongoose = require("mongoose");
const Joi = require("joi");
const { testDate, testPhoneNum } = require("../utils/validator");

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    jobTitle: {
      type: String,
    },

    phoneNo: {
      type: String,
      validate: {
        validator: (number) => {
          return testPhoneNum(number);
        },
        msg: "Invalid phone number format",
      },
    },

    lifeCycle: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      validate: {
        validator: (email) => {
          return !Joi.string().email().validate(email).error;
        },
        msg: "Invalid email format",
      },
    },

    leadStatus: {
      type: String,
    },

    lastActivityDate: {
      type: String,
      validate: {
        validator: (date) => {
          return testDate(date);
        },
        msg: "Invalid date format",
      },
    },

    createDate: {
      type: String,
      validate: {
        validator: (date) => {
          return testDate(date);
        },
        msg: "Invalid date format",
      },
    },

    contactOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    emailLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Email" }],

    company: { type: String, ref: "Company" },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

schema.virtual("fullName").get(function () {
  const fullName = `${this.firstName} ${this.lastName}`;
  return fullName;
});

const model = mongoose.model("Contact", schema);
module.exports = model;
