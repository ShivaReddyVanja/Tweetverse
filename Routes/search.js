const express = require('express');
const router = express.Router();
const User = require('../dbModels/User');
const Tweet = require('../dbModels/Tweet');
const axios = require('axios');
router.post("/",async (req,res)=>{
    const {query} = req.body
    console.log(query)
    try{
       const response =await  User.findOne({Username:query}).select({Password:0})
       if(!response){
        const responseFromOther = await axios.post('http://192.168.110.79:3000/api/search/forwarded',{
            query:query
        });
       console.log(responseFromOther)
       

       }
       else{
        console.log(response)
        res.json({response})
       }

    }
    catch(error){
        console.log("error coccured",error);

    }
})
router.post('/forwarded',async (req,res)=>{
    const {query}= req.body
    try{
        const response =await  User.findOne({Username:query}).select({Password:0})
        if(response){
           return res.json({message:"user data found", response})

        }
        else{
            res.json({message:"no such user found"})}
        

    }
    catch(error){
        console.log("error at forwarded query");

    }
})



module.exports = router;