const express = require("express")
const userRouter = express.Router()


userRouter.get("/",(req,res)=>{
    res.send("base api endpoint")
})

module.exports = {userRouter}