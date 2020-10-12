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

    companyDomainName:{
        type:String,
        required: true
    },

    phoneNumber:{
        type: String
    }, 

    type:{
        type:String
    },
    
    city:{
        type: String
    },

    state_region:{
        type:String
    },

    country:{
        type: String
    },

    industry:{
        type: String,
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