const mongoose = require('mongoose');
const tweetSchema = new mongoose.Schema({
    Content:{
        type:String,
        required:true,
    },
    TweetedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    Likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        }
    ],
    RetweetBy:[
        {
            type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        }
    ],
    Image:String,
    Replies:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tweet'
        },
    ],


    
},{timestamps:true})
module.exports = mongoose.model('Tweet',tweetSchema)