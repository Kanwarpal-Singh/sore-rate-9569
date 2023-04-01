const express = require("express");
const {UserModel}=require("../models/usermodel");
const bcrypt = require('bcrypt');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const {authMiddleware}=require("../middleware/authentication");
const {blacklist} = require("../blacklist")

const otp = require("generate-otp");
const cookieParser = require("cookie-parser")



const sendgrid = require("@sendgrid/mail");
sendgrid.setApiKey(process.env.apikey)



 
const userRouter = express.Router()




userRouter.post("/sign_up",async(req,res)=>{
   try{
    const {username,email,password}=req.body;

    ///check if email already exists

    const isEmailExists= await UserModel.findOne({email})

    if(isEmailExists){
        res.status(400).json({ message: 'User already exists' });
    }

    ///hashing the password

    const hash = bcrypt.hashSync(password, 8);
    
    ///creating a new user
    
    const newUser= new UserModel({username,email,password:hash})
    await newUser.save()
    res.json({ message: 'User created successfully' });
   }

   catch(err){
    res.send(err);
   }
    
})


 userRouter.post("/sign_in",async(req,res)=>{
    try{
       const {email,password}=req.body;

       const user=await UserModel.findOne({email})

       if(!user){
        res.send({"msg":"Invalid email"})
       }

       const isPasswordMatch=await bcrypt.compare(password, user.password);

       if(!isPasswordMatch){
        res.send("enter valid credentials")
       }

       ///create token

       const token=jwt.sign({ userID: user._id }, process.env.jwtKey , { expiresIn: 60 });

       ///create refresh token

       const refreshToken=jwt.sign({ userID: user._id }, process.env.refreshJwtKey , { expiresIn: 300 });

       res.send({"msg":"Login successful","token":token,"refreshToken":refreshToken})

    }
    catch(err){
        console.log(err)
    }
 })

 ///creating a new normal token  

 userRouter.get("/getnewtoken",(req,res)=>{

    const refreshToken=req.headers.authorization.split(" ")[1];

    ///checking if refeshToken exist

    if(!refreshToken){
        return res.send("login first")
     }

    jwt.verify(refreshToken, process.env.refreshJwtKey,(err, decoded)=>{
        if(err){
           return res.send("Please login first")
        }
         ///create new token

         const token=jwt.sign({ userID: decoded._id }, process.env.jwtKey , { expiresIn: 60 });

         res.send({"msg":"Login successful","token":token,"refreshToken":refreshToken})
      });
 })
 
 ///sign_out route

 userRouter.get("/sign_out",(req,res)=>{
    blacklist.push(req.headers?.authorization?.split(' ')[1]);
    res.send("logout successful")

 })



 //email verification using OTP

userRouter.post("/getotp",async(req,res)=>{
    try {
        const {email} = req.body
        if(!email){
            return res.status(400).send({"msg":"Enter Email first!"})
        }
        const mail = await UserModel.findOne({email})
        if(!mail){
            return res.status(400).send({"msg":"User not found, please register again."})
        }else{

            const generateOtp = otp.generate(4)
            
          res.cookie("otp",generateOtp)
            //client.LPUSH("otp",generateOtp.toString())
            const msg = {
                to:`${mail.email}`,
                from:"manthanpelneoo7@gmail.com",
                subject:"Email Verification",
                text:"Email Verification",
                html: `<p>Verify your email using OTP: <h1>${generateOtp}</h1></p>`,
            }
            sendgrid
              .send(msg)
              .then(() => {}, error => {
                console.error(error);
            
                if (error.response) {
                  console.error(error.response.body)
                }
              });
            res.send({"msg":"OTP sent successfully!!",generateOtp})
        }
    } catch (error) {
        console.log(error.message)
    }
})


userRouter.post("/verifyotp",async(req,res)=>{
    try {
        let otp = req.body.otp
        let result = req.cookies.otp

        if(!otp){
            return res.status(400).send({"msg":"Please insert OTP to verify your Email !!"})
        }
        if(otp!==result){
         return res.status(400).send("Invalid OTP !!")
        }

    } catch (error) {
        console.log(error.message)
    }
    res.send({"msg":"Email successfully verified..!!"})
})



  
  ///sample route for checking authentication
 userRouter.get("/details",authMiddleware,(req,res)=>{
      res.send("details")
 })

 userRouter.get("/",(req,res)=>{
    res.send("info")
})

module.exports = {userRouter}