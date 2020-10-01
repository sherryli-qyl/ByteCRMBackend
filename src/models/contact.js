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
        email: {
            type: String,
            required: true,
            validate: {
                validator: (email) => {
                    // const validation = Joi.string().email().validate(email);
                    // const error = validation.error;
                    // // return false代表validator验证失败
                    // if (error) {
                    //   return false;
                    // } else {
                    //   return true;
                    // }

                    // 如果error有值，则校验失败
                    return !Joi.string().email().validate(email).error;
                },
                msg: 'Invalid email format'
            }
        },
        companies:
            //{type: 
            [{ type: String, ref: 'Company' }],
        //select: false
        //default:[]
        //},
        __v: {
            type: Number,
            select: false
        }
    }
);

const model = mongoose.model('Contact', schema);
module.exports = model; 
