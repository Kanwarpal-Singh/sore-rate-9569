const express = require("express");
const { urlModel } = require("../models/url.model")
const shortid = require('shortid');
const urlRouter = express.Router();


//...........search dynamically........
 
urlRouter.get("/data/search", async (req, res) => {
  try {
    const searchData = req.query.key;
    console.log(searchData)
    const query = {
      $or: [
        { shortId: { $regex: searchData, $options: "i" } },
        { title: { $regex: searchData, $options: "i" } },
        { redirectURL: { $regex: searchData, $options: "i" } },
      ],
    };
    const url = await urlModel.find(query);
    res.send(url);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: "Server error" });
  }
 
});


urlRouter.post("/data", async (req, res) => {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" })
  const shortID = shortid.generate()
  try {
    const data = new urlModel({
      shortId: shortID,
      title: body.title,
      redirectURL: body.url,
      visitHistory: [],
    })
    await data.save()
    return res.send({ "msg": " new shortID geberate" })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
})


urlRouter.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await urlModel.findOneAndUpdate({ shortId }, { $push: { visitHistory: { timestamp: new Date() } } })
    if (!entry) {
      return res.status(404).json({ error: "Entry not found1" });
    }
    res.redirect(entry.redirectURL);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
})

urlRouter.get("/", async (req, res) => {
  try {
    const entry = await urlModel.find({}).sort({createdAt:-1})
    let inputDate = new Date(entry[0].createdAt)
    // define the target time zone identifier
    const targetTimeZone = 'Asia/Kolkata';

    // convert the input date to the target time zone
    const targetDate = new Date(inputDate.toLocaleString('en-US', {
      timeZone: targetTimeZone
    }));

    // format the target date string
    const targetDateString = targetDate.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZoneName: 'short',
      timeZone: targetTimeZone
    });

    // console.log(targetDateString);
    if (!entry) {
      return res.status(404).json({ error: "Entry not found2" });
    }
    res.send(entry);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
})

//..............delete functionality................
urlRouter.delete("/delete",async(req,res)=>{
    let data=req.body.title;
    console.log(data)
    await urlModel.findOneAndDelete({"title":data})
    let urldata= await urlModel.find({}).sort({createdAt:-1})
    res.send(urldata)
})




module.exports = { urlRouter }
