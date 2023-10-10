const express = require('express');
const authenticateJwt = require('../middleware/authenticateJWT');
const router = express.Router();
const User = require('../dbModels/User')
const Tweet = require('../dbModels/Tweet')
const fs= require('fs');
router.use(express.json())


router.put('/:id/follow', authenticateJwt, async (req, res) => {
    const username = req.user;
    const idToFollow = req.params.id;
    try {
        //getting details of both the loggeduser, and userToFollow
        const [loggedUser, userToFollow] = await Promise.all([User.findOne({ Username: username }).select({ Following: 1 }), User.findById(idToFollow).select({ Followers: 1 })]

        )
        //if the user not found return error
        if (!loggedUser || !userToFollow) {
            return res.status(403).json({ message: "no such user found" });

        }
        //user cannot follow himself
        if (loggedUser._id.equals(idToFollow)) {
            return res.status(403).json({ message: "Cannot follow yourself" });
        }
        //if user already following the requested user, should not be allowed
        if (!loggedUser.Following.includes(idToFollow)) {
            loggedUser.Following.push(idToFollow);
            userToFollow.Followers.push(loggedUser._id);
            await Promise.all([loggedUser.save(), userToFollow.save()]
            )
            res.status(200).json({ message: "success" })
        }
        else {
            res.status(403).json({ message: "already following user" })

        }


    }
    catch (error) {
        console.error("error while following the requested user", error);
        res.status(500).send("Internal server error");
    }


})
router.post('/:id/unfollow', authenticateJwt, async (req, res) => {
    const username = req.user;
    const idToUnfollow = req.params.id;
    try {
        //getting details of both the loggeduser, and userToFollow
        const [loggedUser, userToUnfollow] = await Promise.all([
            User.findOne({ Username: username }).select({ Following: 1 }),
            User.findById(idToUnfollow).select({ Followers: 1 })]

        )
        //a user cannot unfollow those who he is not following
        const indexInFollowing = loggedUser.Following.indexOf(idToUnfollow)
        const indexInFollowers = userToUnfollow.Followers.indexOf(loggedUser._id)
        if ((indexInFollowing !== -1) && (indexInFollowers !== -1)) {
            loggedUser.Following.splice(indexInFollowing, 1);
            userToUnfollow.Followers.splice(indexInFollowers, 1);
            await Promise.all([
                loggedUser.save(), userToUnfollow.save()
            ])
            res.status(201).json({ message: "success" })
        }
        else {
            res.status(403).json({ message: "unable to unfollow ,cannot find such user" })
        }

    }
    catch (error) {
        console.error("error while unfollowing the given user", error)
        res.status(500).json({ message: "internal server error" });

    }

})
//route to get a user details
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    
    try {
        const projection = {
            Password: 0
        }
        //excluding password field from the response data, and populating followers and following fileds
        const user = await User.findById(userId).select(projection)
        .populate('Followers', '_id Name Username Email')
        .populate('Following', '_id Name Username Email')
        .populate({
            path: 'Tweets',
            populate: [
                { path: 'TweetedBy', select: '_id Name Username Email' },
                { path: 'Likes', select: '_id Name Username Email' },
                { path: 'RetweetBy', select: '_id Name Username Email' },
                { path: 'Replies', select: '_id Content createdAt' }
            ]
        });
        if (!user) {

            return res.status(400).json({ message: "user not found" })
        }
        const userWithBase64Tweets = {
            ...user.toJSON(),
            Tweets: await Promise.all(
              user.Tweets.map(async (tweet) => {
                if (tweet.Image) {
                  const imageBuffer = fs.readFileSync(tweet.Image); 
                  const base64Image = imageBuffer.toString('base64');
                  
                  return {
                    ...tweet.toJSON(),
                    Image: base64Image,
                    TweetedBy: user.Username,
                  };
                }
                return tweet.toJSON();
              })
            ),
          };
        
        res.json({ message: "user data", user: userWithBase64Tweets })
    }
    catch (error) {
        console.error("error while fetching user details", error);
        res.status(500).json({ message: "internal server error" });
    }

})




//route to edit userdetails
router.put("/:id",authenticateJwt,async(req,res)=>{
    const username = req.user
    const {Name, DateOfBirth,Location } = req.body
    try{
        const projection = {
            Name:1,DateOfBirth:1,Location:1
        }
        const user = await User.findOne({Username:username}).select(projection)
        if(!user){
            res.status(401).json({message:"User not found"});

        }
        //only these fileds can be edited
        user.Name= Name;
        user.DateOfBirth = DateOfBirth;
        user.Location = Location;
        await user.save();
        res.status(201).json({message:"data updated successfully"})

    }
    catch(error){
        console.log("error while editing the user details", error)
        res.status(500).json({message:"Internal server error"})
    }
})

module.exports = router;
