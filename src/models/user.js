const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const schema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },

  lastname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    validate: {
      validator: (email) => {
        return !Joi.string().email().validate(email).error;
      },
      msg: 'Invalid email format',
    },
  },

  password: {
    type: String,
    required: true,
    validate: {
      validator: (password) => {
        return Joi.string()
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
          .validate(password).error;
      },
      msg: 'Invalid password',
    },
  },
  __v: {
    type: Number,
    select: false,
  },
});

//instance method and static method
//Model.static
//document.instance

schema.methods.hashPassword = async function () {
  this.password = await bcrypt.hash(this.password, 12);
};

schema.methods.validatePassword = async function (password) {
  //return true or false
  const validPassword = await bcrypt.compare(password, this.password);
  return validPassword;
};

// lifecycle hook
// pre save hook

const model = mongoose.model('User', schema);
module.exports = model;
