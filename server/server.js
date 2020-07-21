const express = require("express");
const app = express();
const path = require(`path`);
const bodyParser = require("body-parser");
app.enable("trust proxy");
require("dotenv").config();
let schedule = require("node-schedule");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// const User = require("./models/userModel.js");
// const Email = require("./handlers/email.js");
//
// //midnight and midday '0 0 0,12 * *'
// let j = schedule.scheduleJob("*/10 * * * * *", function () {
//   // Email.sendMorningMail()
//   //   .then((res) => {})
//   //   .catch((err) => {});
//
//   User.getAllEmailTimesForUsers()
//     .then((users) => {
//       users.forEach(function (userItem) {
//         //schedule job for morning time for user
//         let res = userItem.morning_time.split(":");
//         let rule = new schedule.RecurrenceRule();
//         rule.hour = res[0];
//         rule.minute = res[1];
//         rule.second = res[2];
//         //schedule job for evening time for user
//         let res_afternoon = userItem.evening_time.split(":");
//         let rule_afternoon = new schedule.RecurrenceRule();
//         rule_afternoon.hour = res_afternoon[0];
//         rule_afternoon.minute = res_afternoon[1];
//         rule_afternoon.second = res_afternoon[2];
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// let user = ["alex", "leo", "mom", "dad"];
// let morningTime = [2, 10, 20, 30];
// for (let i = 0; i < user.length; i++) {
//   let rule = new schedule.RecurrenceRule();
//   rule.second = new schedule.Range(0, 59, morningTime[i]);
//
//   let j = schedule.scheduleJob(rule, function () {
//     console.log("Message from " + user[i] + " " + morningTime[i]);
//   });
// }

// future use - app.use(passport.initialize())
// future use - app.use(passport.session())

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

/**
 * since we are using client-side react routing, we
 * need to manually serve index.html when a request is made
 * for /create-account or /home
 */
app.get("/team-overview", function (req, res) {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.get("/settings", function (req, res) {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.get("/create-account", function (req, res) {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.get("/home", function (req, res) {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.use("/", require("./routes/index.js"));

// Listen to the environment-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
