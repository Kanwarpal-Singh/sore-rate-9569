const mongoose=require("mongoose")

const urlSchema=new mongoose.Schema({
    shortId:{
        type:String,
        required:true,
        unique:true
    },
    title:{
        type:String,

    },
    redirectURL:{
        type:String,
        required:true
    },
    
    visitHistory:[{timestamp:{type:Number}}],
},{timestamps:true})

const urlModel=mongoose.model("url",urlSchema)

module.exports={urlModel}