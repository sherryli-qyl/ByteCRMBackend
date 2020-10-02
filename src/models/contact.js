const mongoose = require('mongoose');
const Joi = require('joi');

const schema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String,
            required: true
        },
        jobTitle: {
            type: String,
        },

        phoneNo: {
            type: Number,
        },

        lifeCycle:{
            type: String,
        },

        contactOwner:{
            type: String,
        },

        email: {
            type: String,
            required: true,
            validate: {
                validator: (email) => {
                    return !Joi.string().email().validate(email).error;
                },
                msg: 'Invalid email format'
            }
        },
        company:
            {type: String, ref: 'Company'},

        // contactOwner:
        //     {type:String,ref:'User'},

        __v: {
            type: Number,
            select: false
        }
    }
);

const model = mongoose.model('Contact', schema);
module.exports = model; 
