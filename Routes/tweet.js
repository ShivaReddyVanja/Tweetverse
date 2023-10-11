const express = require('express');
const router = express.Router();
const authenticateJwt = require("../middleware/authenticateJWT");
const User = require('../dbModels/User');
const Tweet = require('../dbModels/Tweet');
const idValidator = require("../middleware/idValidator")
const mutler = require('multer');
const upload = require('./../middleware/mutler')
const fs = require('fs')

//posting a tweet with content - text,image
router.post('/', authenticateJwt, upload.single('image') ,async (req, res) => {
    const {content} = req.body;
    const username = req.user;

    try {
        const user = await User.findOne({ Username: req.user })
        if (content) {
            // Check if an image was uploaded
            const image = req.file ? req.file.path : null;
            const newTweet = new Tweet({
                 Content: content,
                  TweetedBy: user._id,
                  Image: image, // Add the image URL to the tweet
                 });
            await newTweet.save();
            user.Tweets.push(newTweet._id);
            user.save();
            console.log(newTweet._id);
            
            res.status(200).json({ message: "tweeted sucessfully" });
        }
        else {
            res.status(403).json({ message: "content cannot be empty" })
        }
    }
    catch (error) {
        res.status(500).json({ message: "internal server error", error });
    }

})
//like route
router.post('/:id/like', authenticateJwt,idValidator, async (req, res) => {
    const tweetId = req.params.id;
    try {
        //extracting the user details and tweet details from the data base
        const [user, tweet] = await Promise.all([User.findOne({ Username: req.user }).select({ _id: 1 }), Tweet.findById(tweetId)]);
        //finding if a user already liked the current tweet,if so we directly return
        const alreadyLiked = tweet.Likes.includes(user._id);
        console.log(alreadyLiked);

        if (alreadyLiked) {

            return res.status(403).json({ message: "already liked" });
        }
        //if user and tweet both exists then we allow user to like
        if (user && tweet) {
            tweet.Likes.push(user._id);
            await tweet.save();
            res.status(201).send("liked successfully");
        }
        else {
            res.status(403).send("unable to like");
        }
    }
    catch (error) {
        res.status(500).send("internal server error");
    }

})
//dislike route
router.post('/:id/dislike', authenticateJwt,idValidator, async (req, res) => {
    const tweetId = req.params.id;
    try {
        //extracting the user details and tweet details from the data base
        const [user, tweet] = await Promise.all([User.findOne({ Username: req.user }).select({ _id: 1 }), Tweet.findById(tweetId)]);
        const alreadyLiked = tweet.Likes.includes(user._id);
        if (alreadyLiked === false) {
            return res.status(403).json({ message: "only liked tweets can be disliked" });
        }

        if (user && tweet) {
            const userIndex = tweet.Likes.indexOf(user._id);
            if (userIndex != -1) {
                tweet.Likes.splice(user._id, 1)
                tweet.save();
                res.status(201).send("disliked successfully");
            }
            else {
                res.status(403).send("cannot dislike ")

            }
        }
        else {
            res.status(403).send("unable to like");
        }
    }
    catch (error) {
        res.status(500).send("internal server error");
    }

})
//route to reply for a tweet
router.post("/:id/reply",authenticateJwt,idValidator, async (req, res) => {
    
    try {
        const tweetId = req.params.id;
        const {content} = req.body;
        
        const [user, tweet] = await Promise.all(
            [User.findOne({ Username: req.user }).select({ _id: 1 }),
            Tweet.findById(tweetId)]);

        if (!content || !user || !tweet) {
            return res.status(403).json({ message: "Content cannot be empty or user/tweet not found" });
        }

            //creating a Reply, which itself is a tweet 
            const newTweet = new Tweet({ Content: content, TweetedBy: user._id });
            await newTweet.save();

            //adding the reply to the tweets Replies array
            tweet.Replies.push(newTweet._id);
            await tweet.save();

            res.status(200).json({ message: "Reply posted successfully" });
        } 
    catch (error){

        console.error(error);
        res.status(500).json({message:"internal server error"});


    }

})
//getting a single tweet details 
router.get('/:id',idValidator,async(req,res)=>{
    try{
    const tweetId = req.params.id;
    const tweet = await Tweet.findById(tweetId).populate({
        path:"TweetedBy Likes RetweetBy",
        select:"-Password"
}).populate({
    path:"Replies",
    populate:{
        path:"TweetedBy Likes RetweetBy",
        select:"-Password"
    }
})
    if (!tweet) {
        return res.status(404).json({ message: "Tweet not found" });
    }

    return res.status(200).json(tweet);
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }


})
//fetches all tweets, and details of tweeters
router.get("/",async(req,res)=>{
 
    
    try{
        //this will limit the data fetch per hit
        const tweets = await Tweet.find({}).limit(25).populate({
            path:"TweetedBy",
            select:"-Password"
        }).sort({createdAt:-1})
        const tweetsWithImages = [];
        for (const tweet of tweets) {
          const tweetData = tweet.toJSON();
          // Assuming each tweet has an 'imagePath' field that stores the path to the image
          const imagePath = tweetData.Image; // Replace with your actual field name
          // Read the image file and add its data to the tweet data
          if (imagePath) {
            try{
            const imageBuffer = fs.readFileSync(imagePath);
            tweetData.Image = imageBuffer.toString('base64');
        }
            catch(error){
                console.log(error);
            }

            
          }
          tweetsWithImages.push(tweetData);
        }
        res.status(200).json({
            message: "Tweets fetched successfully",
            tweets: tweetsWithImages
          });
        


    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"internal server error"})
    }
})

//delete a tweet
router.delete("/:id",authenticateJwt,idValidator,async (req,res)=>{
    try{
        const tweetId = req.params.id;
        const [tweet,user]= await Promise.all([Tweet.findById(tweetId)
            , User.findOne ({Username:req.user})])
        if(!tweet){
            return res.status(403).json({message:"tweet not found"})
        }
        if(!user){
            return res.status(403).json({message:"user not found"})
        }
        if(user._id.toString()===tweet.TweetedBy.toString()){
            
            await tweet.deleteOne();
            return res.status(200).json({message:"tweet deleted sucessfully"});
        }
            
        res.status(401).json({message:"Tweets can only be deleted by owner"})

    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"internal server error"})

    }

})

//retweet route
router.post('/:id/retweet',authenticateJwt,idValidator,async (req,res)=>{
    try{
        const tweetId = req.params.id;
        const [tweet,user]= await Promise.all([Tweet.findById(tweetId)
            , User.findOne ({Username:req.user})]);
            if(!tweet){
                return res.status(403).json({message:"tweet not found"})
            }
            if(!user){
                return res.status(403).json({message:"user not found"})
            }
            if(tweet.RetweetBy.includes(user._id)){
                return res.status(403).json({message:"Already retweeted"})
            }
            tweet.RetweetBy.push(user._id);
            await tweet.save();
            res.status(201).json({message:"Retweeted sucessfully"});
        
        

    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"internal server error"});
    }

})

module.exports = router
