const mongoose = require ('mongoose'); 

const schema = new mongoose.Schema({ 
    _id: {
        type: String,
        uppercase: true,
        alias: 'code'
    },
    
    name:{
        type: String,
        required: true
    },

    phoneNumber:{
        type: String
    }, 
    
    city:{
        type: String
    },

    country:{
        type: String
    },

    industry:{
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
      companyOwner:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    
    contacts: [{
         type: mongoose.Schema.Types.ObjectId, ref: 'Contact' 
        }],
   
    __v:{
        type: Number,
        select: false
    }
},
    {
        toJSON: {
            virtuals: true
        },
        id: false,
        timestamps: true
    }
);      

// schema.virtual('code').get(function(){
//     return 'virtual code';
// });

const model = mongoose.model('Company',schema); 

module.exports = model; 