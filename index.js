const express = require("express");
const app = express();
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose");
app.use(express.json());
const cors = require('cors')
app.use(cors());

const config = require('./config');
const SECRET_KEY = config.SECRET_KEY;
const DB_URL = config.DB_URL;
const PORT = config.PORT;
const authRoutes = require("./Routes/auth")
const userRoutes = require("./Routes/user")
const tweetRoutes = require("./Routes/tweet");
const searchTweets = require("./Routes/search");
const User = require('./dbModels/User')
const authenticateJwt = require("./middleware/authenticateJWT");
const MY_IP = config.MY_IP;


app.post("/api/me",authenticateJwt,async (req,res)=>{
    try{
        const username = req.user;
        console.log(username);
        const user = await User.findOne({Username:username}).select({Password:0});
        if(user){
            res.status(201).json({user});
        }
        else{
            res.status(400).json({message:"no user data found"});
        }
    }
    catch(error){
        res.status(500).json({message:"internal server error"});

    }
    
   
})




app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/tweet",tweetRoutes);
app.use("/api/search",searchTweets);

app.listen(PORT,MY_IP,()=>{
    console.log("listening on "+`http://${MY_IP}:3000`)
})

mongoose.connect(DB_URL).then(()=>{
    console.log("connected to db");
})


