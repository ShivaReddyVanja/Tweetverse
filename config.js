require('dotenv').config();
const PORT = process.env.PORT||3000
const DB_URL = "mongodb://localhost:27017/Tweetverse"
const SECRET_KEY = "HSKKDNNFBDIKLOJDN"
const MY_IP = "192.168.110.200"
module.exports={
    PORT,
    DB_URL,
    SECRET_KEY,
    MY_IP
};


