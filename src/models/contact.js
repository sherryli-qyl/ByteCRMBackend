const mongoose = require ('mongoose'); 
const Joi = require('@hapi/joi');

const schema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        validate: {
            validator:(email) => {
            return !Joi.string()
            .email()
            .validate(email).error;
        },
            msg:'invalid email format'
        }
    },
    companies: {
        type: [{ type: String, ref: 'Company' }],
        //select: false
        //default:[]
    },
    __v: {
      type: Number,
      select: false
    }
});      

const model = mongoose.model('Contact',schema); 
module.exports = model; 
