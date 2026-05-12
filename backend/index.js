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
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});