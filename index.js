const express = require("express")
const app = express()
require("dotenv").config()
const {userRouter} = require("./routes/userroute")
const {connection} = require("./db")
const cors = require("cors")

app.use(cors())
app.use(express.json())


app.use("/user",userRouter)


app.listen(process.env.port,async()=>{
    await connection
    console.log(`running at server ${process.env.port}`)
})