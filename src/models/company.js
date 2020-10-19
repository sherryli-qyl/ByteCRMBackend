const mongoose = require("mongoose");
const { testDate, testPhoneNum } = require("../utils/validator");

const schema = new mongoose.Schema(
  {
    // id: {
    //   type: String,
    //   uppercase: true,
    //   alias: "code",
    // },

    name: {
      type: String,
      required: true,
    },

    companyDomain:{
        type:String,
    },

    phoneNumber: {
      type: String,
    },

    city: {
      type: String,
    },

    country: {
      type: String,
    },

    industry: {
      type: String,
    },

    lastLoggedCallDate: {
      type: String,
      validate: {
        validator: (date) => {
          return testDate(date);
        },
        msg: "Invalid date format",
      },
    },
    
    companyOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    associatedContacts: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Contact' 
       }],

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
  }
);

// schema.virtual('code').get(function(){
//     return 'virtual code';
// });

const model = mongoose.model("Company", schema);

module.exports = model;
