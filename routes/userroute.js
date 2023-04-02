const express = require("express");
const {UserModel}=require("../models/usermodel");
const bcrypt = require('bcrypt');
require("dotenv").config();
const jwt = require('jsonwebtoken');
const {authMiddleware}=require("../middleware/authentication");
const {blacklist} = require("../blacklist")
const {otpmodel} = require("../models/otpmodel")

const otp = require("generate-otp");
const cookieParser = require("cookie-parser")
const nodemailer = require("nodemailer")

const fs = require("fs")


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
       const {email,password}=req.body;
    try{
       const user=await UserModel.findOne({email})
       if(user){
        bcrypt.compare(password, user.password,(err,result)=>{
            if(result){
                const token=jwt.sign({ userID: user._id }, process.env.jwtKey , { expiresIn: "10m" });
                const refreshToken=jwt.sign({ userID: user._id }, process.env.refreshJwtKey , { expiresIn: 300 });
                res.status(200).send({"msg":"Login Successfull","token":token,"refreshToken":refreshToken,user})
            }else{
                res.status(400).send({"error":"Please Check you Password!"})
                console.log("err")
            }
          });
        }else{
           res.status(400).send({msg:"User Not Found!"})
            console.log("Please sign up first!")
        }
    }catch(error){
        console.log("error:",error) 
        res.status(400).send("error:",error)
    } 
 })       
 

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

 userRouter.get("/logout", (req, res) => {
    const token = req.headers.authorization
    const blacklisteddata = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"))
    blacklisteddata.push(token)
    fs.writeFileSync("./blacklist.json", JSON.stringify(blacklisteddata))
    res.send({"msg":"Logout Successfull"})
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
            const otpdata = new otpmodel({
             otp:generateOtp
            })
            await otpdata.save()
            //res.cookie("otp",generateOtp)

          
            let mailTransporter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:"manthanpelneoo7@gmail.com",
                    pass:process.env.pass
                }
            })
            let details = {
                from:"manthanpelneoo7@gmail.com",
                to:`${mail.email}`,
                subject:"Verify Email using OTP",
                text:"Validate Email:",
                html:`<p>Verify your Email using OTP: <h2>${generateOtp}</h2></p>`
            }

            mailTransporter.sendMail(details,(err)=>{
                if(err){
                    console.log("It has an error",err)
                }else{
                    console.log("email has sent")
                }
            })

            res.send({"msg":"OTP sent successfully!!",generateOtp,otpdata})
        }
    } catch (error) {
        console.log(error.message)
    }
})


userRouter.post("/verifyotp",async(req,res)=>{
    try {
        let otp = req.body.otp
        // // let result = req.cookies.otp
        // //  console.log(result)
        if(!otp){
            return res.status(400).send({"msg":"Please insert OTP to verify your Email !!"})
        }
    
        let checkotp = await otpmodel.findOne({otp})
        if(!checkotp){
            return res.status(400).send({"msg":"Incorrect OTP. Please try again"})
        }

        if(otp!==checkotp.otp){
         return res.status(400).send({"msg":"Invalid OTP!!"})
        }
        res.send({"msg":"Email successfully verified..!!",checkotp})
    } catch (error) {
        console.log(error.message)
    }
})



  
  ///sample route for checking authentication
 userRouter.get("/details",authMiddleware,(req,res)=>{
      res.send("details")
 })

 userRouter.get("/",(req,res)=>{
    res.send("info")
})

module.exports = {userRouter}