const mongoose = require('mongoose');

const idValidator =(req,res,next)=>{
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid tweet ID format" });
    }
    else{
        
        next();
    }
}
module.exports = idValidator;
