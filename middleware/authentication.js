const jwt=require("jsonwebtoken");
const { UserModel } = require("../models/usermodel");
const {blacklist}=require("../blacklist")
require("dotenv").config();
const fs = require("fs")

const authMiddleware=async(req,res,next)=>{
    try{
        const token = req.headers.authorization
        if(!token){
            res.status(400).send({"msg":"Login again"})
        }
        const blacklisteddata = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"))
    
        if(blacklisteddata.includes(token)){
           return  res.status(400).send({"msg":"Login first"})
        }

        const decodedToken = jwt.verify(token, process.env.jwtKey);

        const {userID}=decodedToken

        ///check if the user exist

        const user= await UserModel.findById(userID)

        if(!user){
            return res.status(400).send({"msg":"User not found"})
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