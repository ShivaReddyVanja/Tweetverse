const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {check,validationResult} = require("express-validator");
const validateSignup = require('../middleware/validateSignup');
const User = require('../dbModels/User');
const { SECRET_KEY } = require('../config');
const bcrypt = require('bcrypt')




router.post("/signup",validateSignup,async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({erros:errors});
    }
    
    const {username,email,name,password} = req.body;
    try{
        const existingUser =await  User.findOne({ $or: [{ Username:username }, { Email:email }] });

        if(existingUser!=null){
            
            return res.status(400).json({message:"Username or Email already exists"})
        }
        const hashedPassword= await bcrypt.hash(password,10);
        const newUser = new User({Email:email,Username:username,Name:name,Password:hashedPassword})
        await newUser.save();
        const token = jwt.sign({username},SECRET_KEY,{expiresIn:'10h'})
        res.status(201).json({message:"User successfully registered ",token})

    }
    catch(error){
        console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });

    }



    

});
router.post("/login",async (req,res)=>{
    const {usernameorEmail,password} =req.body;
    
    try{
        console.log(usernameorEmail)
        const user = await User.findOne({$or: [{Username:usernameorEmail},{Email:usernameorEmail}]})
        
        //check if user with given details found or not
        if(!user){
            return res.status(400).json("No user found")
        };
        //check if the provided password matches with the user found
        const passwordMatch =await bcrypt.compare(password,user.Password)
        
        if(!passwordMatch){
            return res.status(401).json({message:"Invalid password"})

        }
        //generate a token and sent response 
        const token = jwt.sign({username:user.Username},SECRET_KEY,{expiresIn:'10h'});
        res.status(201).json({message:"Logged in sucessfully",token});


    }
    catch(error){
        console.error('Error while login:', error);
        res.status(500).json({ message: 'Internal server error' });

    }



});

module.exports = router;