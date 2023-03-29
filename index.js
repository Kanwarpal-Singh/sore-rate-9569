const express = require("express")
const app = express()
require("dotenv").config()
const {userRouter} = require("./routes/userroute")
const {connection} = require("./db")
const cors = require("cors")
const { urlencoded } = require("express")
const qrcode = require("qrcode")
const {qrRouter} = require("./routes/qrRouter")

app.use(cors())
app.use(express.json())
app.use(urlencoded({extended:false}))


app.use("/user",userRouter)
app.use("/qr",qrRouter)


app.listen(process.env.port,async()=>{
    await connection
    console.log(`running at server ${process.env.port}`)
})