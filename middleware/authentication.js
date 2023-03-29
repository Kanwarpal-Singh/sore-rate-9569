const jwt=require("jsonwebtoken");
const { UserModel } = require("../models/usermodel");
const {blacklist}=require("../blacklist")
require("dotenv").config();


const authMiddleware=async(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(' ')[1];

        ///checking if the token exist in the BlackList

        if(blacklist.includes(token)){
            return res.send("Pls login again")
        }

        const decodedToken = jwt.verify(token, process.env.jwtKey);

        const {userID}=decodedToken

        ///check if the user exist

        const user= await UserModel.findById(userID)

        if(!user){
            return res.send("Login again")
        }

         // Attach the user to the request object
          req.user = user;

        next()
    }
    catch(err){
         console.log(err)
    }
}


module.exports={
    authMiddleware
}