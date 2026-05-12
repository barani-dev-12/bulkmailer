const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://baranibtech4_db_user:123@cluster0.tach31f.mongodb.net/passkey?appName=Cluster0").then(() => { console.log("Connected to db") }).catch(() => { console.log("Failed to connect") })

const credential = new mongoose.model("credential", {}, "bulkmail")

app.get("/test", (req, res) => {
  res.send("API is reachable!");
});

app.post("/sendemail", (req, res) => {
  console.log("Received request to /sendemail");
  var msg = req.body.emailmsg;
  var emaillist = req.body.emaillist;
  credential.find().then((data) => {
    if (data.length === 0) {
      console.log("No credentials found in database");
      return res.send(false);
    }

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

app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port " + (process.env.PORT || 5000))
})