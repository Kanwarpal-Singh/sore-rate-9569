const express = require("express")
const app = express()
require("dotenv").config()
const {userRouter} = require("./routes/userroute")
const {connection} = require("./db")
const cors = require("cors")
const { urlencoded } = require("express")
const qrcode = require("qrcode")
const {qrRouter} = require("./routes/qrRouter");
const{urlRouter}=require("./routes/url.router")
const passport=require("./google-oauth")
const cookieParser = require("cookie-parser")



app.use(cors())
app.use(express.json())
app.use(urlencoded({extended:false}))


app.use(cookieParser())
app.use("/user",userRouter)
app.use("/qr",qrRouter)
app.use("/url",urlRouter)

///Google-OAuth part

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login',session:false  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/qr/get');
  });


app.listen(process.env.port,async()=>{
    await connection
    console.log(`running at server ${process.env.port}`)
})