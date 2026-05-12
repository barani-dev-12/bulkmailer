const express = require('express');
const cors = require('cors');
const { Resend } = require("resend");
const mongoose = require('mongoose');

const app = express()
const resend = new Resend(process.env.RESEND_API_KEY);

require('dotenv').config()
app.use(cors())
app.use(express.json())


mongoose.connect(process.env.MONGO_URI).then(() => { console.log("Connected to db") }).catch(() => { console.log("Failed to connect") })
const credential = new mongoose.model("credential", {}, "bulkmail")

app.post("/sendemail", async (req, res) => {

  try {

    const msg = req.body.emailmsg;
    const emaillist = req.body.emaillist;

    for (let i = 0; i < emaillist.length; i++) {

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: emaillist[i],
        subject: "A message from bulk mail app.",
        text: msg,
      });

      console.log("Email sent to: " + emaillist[i]);
    }

    res.send(true);

  } catch (err) {

    console.log("Resend Error:", err);
    res.send(false);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});