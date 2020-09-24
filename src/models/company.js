
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
        default: 'this is default information'
    },
    
    contacts: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }],
        //select: false
        //default:[]
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