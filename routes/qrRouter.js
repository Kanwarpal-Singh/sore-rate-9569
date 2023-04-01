const express = require("express")
const qrRouter = express.Router()
const qrcode = require("qrcode")



//qrcode api
let click=0
qrRouter.post("/scan",(req,res)=>{
try {
    const {URL,title} = req.body
    if(URL.length===0){
        return res.status(400).send({"msg":"Empty Data!!"})
    }

    qrcode.toDataURL(URL,(err,src)=>{
        if(src){
            click++
            res.send({"msg":"Here is your QRcode:",src,click,title})
        }
    })
} catch (error) {
    console.log(error.message)
}
})

qrRouter.get("/get",(req,res)=>{
    res.send("got it")
})


module.exports = {qrRouter}