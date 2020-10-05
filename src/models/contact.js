const mongoose = require("mongoose");
const Joi = require("joi");
const testPhoneNum = require("../utils/testPhoneNum");

const schema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (email) => {
        // 如果error有值，则校验失败
        return !Joi.string().email().validate(email).error;
      },
      msg: "Invalid email format",
    },
  },
  phoneNumber: {
    type: String,
    required: false,
    validate: {
      validator: (phoneNum) => {
        return testPhoneNum(phoneNum);
      },
      msg: "Invalid phone number format",
    },
  },
  contactOwner: {
    type: String,
    required: false,
  },
  lastActivityDate: {
    type: Date,
    required: false,
  },
  leadStatus: {
    type: String,
    required: false,
  },
  companies: [{ type: String, ref: "Company" }],
  __v: {
    type: Number,
    select: false,
  },
},
{
    toJSON: {
        virtuals: true,
    },
    timestamps: true,
    firstName: false,
    lastName: false,
});

schema.virtual('name').get(function () {
    return this.firstName + ' ' + this.lastName;
})

const model = mongoose.model("ContactModel", schema);
module.exports = model;
