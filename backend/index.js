const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');

const app = express()

require('dotenv').config()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI).then(() => { console.log("Connected to db") }).catch(() => { console.log("Failed to connect") })

const credential = new mongoose.model("credential", {}, "bulkmail")


app.post("/sendemail", (req, res) => {
 
  var msg = req.body.emailmsg;
  var emaillist = req.body.emaillist;
  credential.find().then((data) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[0].toJSON().user,
        pass: data[0].toJSON().pass,
      },
    });

    new Promise(async function (resolve, reject) {
      try {
        for (var i = 0; i < emaillist.length; i++) {
          await transporter.sendMail(
            {
              from: data[0].toJSON().user,
              to: emaillist[i],
              subject: "A message from bulk mail app.",
              text: msg
            })
          console.log("Email sent to:" + emaillist[i])
        }
        resolve("success")
      }
      catch (err) {
        console.log("Nodemailer error:", err)
        reject("failed")
      }
    }).then(() => { res.send(true) })
      .catch(() => { res.send(false) })

  }).catch((err) => {
    console.log("Database error:", err)
    res.send(false)
  })
})


app.listen(5000, () => {
  console.log("Server is running on port 5000")
})