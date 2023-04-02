const mongoose = require("mongoose")
const otpSchema = mongoose.Schema({
    otp:{type:String,required:true}
})

const otpmodel = mongoose.model("otp",otpSchema)

module.exports = {otpmodel}