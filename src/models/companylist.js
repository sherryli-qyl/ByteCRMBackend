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

    company_owner:{
        type: String,
        required: true
    },
    
    creat_date:{
        type: String,
        required: true
    },

    lastactivity_date:{
        type: String,
        required: true
    },

    phone_number:{
        type: String,
        required: true
    }, 
    
    city:{
        type: String,
        required: true
    },

    country:{
        type: String,
        required: true
    },

    industry:{
        type: String,
        required: true
    },
    
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

const model = mongoose.model('Companylist',schema); 

module.exports = model; 