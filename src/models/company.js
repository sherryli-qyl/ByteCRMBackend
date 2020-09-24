
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

    description:{
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

const model = mongoose.model('Company',schema); 

module.exports = model; 