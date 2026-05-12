import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./index.css"

function App() {
  const [emailmsg, setEmailmsg] = useState("");
  const [statusValue, setstatusValue] = useState(false)
  const [emaillist, setEmaillist] = useState([])
  const [filename, setFilename] = useState("");

  function Send() {
  setstatusValue(true)

  axios.post(
    "https://bulkmailer-1-3fpi.onrender.com/sendemail",
    {
      emailmsg: emailmsg,
      emaillist: emaillist
    }
  )
  .then(function (res) {

    if (res.data === true) {
      alert("Email sent successfully")
    }
    else {
      alert("Error in sending email")
    }

    setstatusValue(false)
  })
  .catch(function (err) {

    console.log(err)
    alert("Network Error")
    setstatusValue(false)
  })
}
  function handleFile(evt) {
    const file = evt.target.files[0];
    console.log(file)
    setFilename(file.name);

    const reader = new FileReader();

    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const firstSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheet]
      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: "A" })
      const totalemails = emaillist.map(function (item) { return item.A })
      setEmaillist(totalemails)
      console.log(totalemails);
    }
    reader.readAsBinaryString(file);
  }

  return (
    <div>
      <div className="text-green-700 bg-white flex justify-between items-center gap-3 p-4">
        <div className="flex">
          <div className="p-2 text-white bg-green-700 border rounded-md"><i className="fa-regular fa-envelope"></i></div>
          <h1 className="text-2xl font-bold mx-2">BulkMail</h1>
        </div>
        <div>
          <p className="font-medium bg-green-100 p-1 border rounded-2xl px-2">Dashboard</p>
        </div>
      </div>
      {/* intro-section */}
      <div className="bg-white flex flex-col items-center text-center gap-4 p-8 m-8 border rounded-xl" style={{ borderColor: "rgb(210, 244, 210)" }}>
        <p className="font-medium px-2 bg-green-100 p-1 border rounded-2xl display inline"><i className="ti ti-bolt"></i>INSTANT BULK SENDING</p>
        <h1 className="font-bold text-green-950 text-4xl">Reach <span className="text-green-700">Everyone</span> </h1>
        <h1 className="font-bold text-green-950 text-4xl"> with one click</h1>
        <p className="text-xl">Upload your list, write your message, and send to thousands — fresh and fast.</p>
      </div>
      {/* flex-containers */}
      <div className="flex justify-around items-center my-8 gap-4 flex-wrap">
        <div className="p-4 bg-white border rounded-xl flex flex-col justify-center items-center w-64 gap-1">
          <h1 className="text-green-700 font-bold text-2xl">99.9%</h1>
          <p>Delivered</p>
        </div>
        <div className="p-4 bg-white border rounded-xl flex flex-col justify-center items-center w-64 gap-1">
          <h1 className="text-green-700 font-bold text-2xl">2.4s</h1>
          <p>Avg send time</p>
        </div>
        <div className="p-4 bg-white border rounded-xl flex flex-col justify-center items-center w-64 gap-1">
          <h1 className="text-green-700 font-bold text-2xl"><i className="fa-solid fa-infinity"></i></h1>
          <p>Recipients</p>
        </div>
      </div>
      {/* input-section */}
      <div className="bg-white flex flex-col items-center text-center gap-4 p-8 m-8 border rounded-xl">
        <div className="bg-white flex items-center text-center gap-2 justify-start w-full">
          <h1 className="text-green-700 p-2 bg-green-100 border rounded-xl"><i className="fa-solid fa-pen"></i></h1>
          <div className="flex flex-col text-left" >
            <p className="font-bold text-black">Compose message</p>
            <p className="text-gray-400">Write what you want to send.</p>
          </div>
        </div>
        <hr className="w-full border-t border-gray-300 my-4" />
        <div className="text-black text-center p-4 w-full">
          <textarea
            onChange={(e) => setEmailmsg(e.target.value)}
            className="w-full min-h-[110px] px-4 py-3 bg-black border border-gray-200 rounded-xl text-sm text-white placeholder-white-300 outline-none resize-none focus:border-gray-500"
            placeholder="Enter the email content..." />
        </div>
      </div>

      {/* Recipients-section */}

      <div className="bg-white flex flex-col items-center text-center gap-4 p-8 m-8 border rounded-xl">
        <div className="bg-white flex items-center text-center gap-2 justify-start w-full">
          <h1 className="text-green-700 p-2 bg-green-100 border rounded-xl"><i className="fa-solid fa-users"></i></h1>
          <div className="flex flex-col text-left" >
            <p className="font-bold text-black">Upload Recipients</p>
            <p className="text-gray-400">Csv or Excel file</p>
          </div>
        </div>
        <hr className="w-full border-t border-gray-300 my-4" />
        <div className="relative border-2 border-dashed border-green-300 rounded-xl p-8 bg-green-50 text-center cursor-pointer w-full hover:bg-green-100 transition-all">
          <input
            type="file"
            onChange={handleFile}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <i className="fa-solid fa-cloud-arrow-up text-3xl text-green-500 mb-3"></i>
          <p className="font-bold text-black text-sm">Drag & drop your file here</p>
          <p className="text-gray-400 text-xs mt-1">or click to browse</p>
        </div>
        {
  filename && (
    <div className="w-full bg-green-50 border border-green-200 rounded-xl p-3 text-left">
      <p className="text-green-700 font-semibold">
        Selected File: {filename}
      </p>
    </div>
  )
}
        <div className="bg-green-100 w-full p-4 text-left border rounded-xl flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <i className="fa-regular fa-envelope text-xl"></i>
            <p className="text-xl text-black font-semibold">Total Emails Loaded:</p>
          </div>
          <h1 className="text-green-500 text-2xl font-bold">{emaillist.length}</h1>
        </div>
        <button onClick={Send} className="w-full p-4 bg-green-400 text-xl font-semibold border rounded-xl">{statusValue ? "Sending..." : "Send"}</button>
      </div>

      <div className="flex justify-around bg-white border border-green-100 rounded-2xl p-4 m-5">

        <div className="flex flex-col items-center gap-2">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <i className="fa-solid fa-lock"></i>
          </div>
          <p className="text-xs font-semibold text-green-700">Encrypted</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <i className="fa-solid fa-chart-bar"></i>
          </div>
          <p className="text-xs font-semibold text-green-700">Analytics</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <i className="fa-solid fa-shield"></i>
          </div>
          <p className="text-xs font-semibold text-green-700">Spam-safe</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <i className="fa-solid fa-rotate"></i>
          </div>
          <p className="text-xs font-semibold text-green-700">Auto-retry</p>
        </div>

      </div>
    </div>
  )
}
export default App;
