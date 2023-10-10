
const jwt = require('jsonwebtoken');
const config = require('./../config');
const { error } = require('console');
const SECRET_KEY = config.SECRET_KEY;
const authenticateJwt = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token,SECRET_KEY,(err,user)=>{
            if(err){
                res.status(403).json({message:"Invalid authorization header "})
            }
            else{
                req.user = user.username;
                next();
            }


        })
    }
    else{
        res.status(401).send("Access denied! no authorization header found")

    }
}
module.exports = authenticateJwt;