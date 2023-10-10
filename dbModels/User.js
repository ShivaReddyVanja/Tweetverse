const mongoose = require('mongoose');
const Tweet = require('./Tweet');

const userSchema = new mongoose.Schema({
    Name :{
        type:String,
        required:true,
    },
    Username:{
        type:String,
        required:true,
        unique:true,
    },
    Email:{
        type:String,
        required:true,
        unique:true,
    },
    Password:{
        type:String,
        required:true,
       
    },
    Profilepic:{
        type:String,
        
        
    },
    Location:{
        type:String,
      
        
    },
    DateOfBirth:{
        type:Date,
        
    },
    Followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    Following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    Tweets:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Tweet',

        }
    ]
},{
    timestamps:true,
});
module.exports = mongoose.model('User',userSchema)