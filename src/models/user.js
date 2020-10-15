const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const schema = new mongoose.Schema({
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

  contacts: [
    {
    type: mongoose.Schema.Types.ObjectId, ref: 'Contact'}
  ],

  companies:[
    {
    type: String, ref: 'Company'}
  ],

  createTasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}],

  __v: {
    type: Number,
    select: false,
  },
},
  {
    toJSON: {
      virtuals: true
    }
  });

//instance method and static method
//Model.static
//document.instance

schema.virtual('fullName').get(function () {
  const fullName = `${this.firstName} ${this.lastName}`;
  return fullName;

});

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
