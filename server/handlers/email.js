const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
let schedule = require("node-schedule");
const _ = require("lodash");
const moment = require("moment");
const User = require("../models/userModel");
const Team = require("../models/teamModel");

let transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secureConnection: false,
  pool: true,
  maxConnections: 1,
  rateDelta: 20000,
  rateLimit: 3,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: process.env.MAIL_AUTH_USER,
    pass: process.env.MAIL_AUTH_PASS,
  },
});

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/email/${filename}.pug`,
    options
  );
  const inlined = juice(html);
  return inlined;
};

const buildHours = function (users, time, serverOffset) {
  let hours = [];
  users.forEach(function (user) {
    let userOffset = moment.tz(user.time_zone).utcOffset();
    let diffInMinutes = serverOffset - userOffset;
    let res;
    if (time === "Morning") {
      res = user.morning_time.split(":");
    } else {
      res = user.evening_time.split(":");
    }
    hours.push((Number(res[0]) + diffInMinutes / 60) % 24);
  });
  return hours;
};

const buildMinutes = function (users, time, serverOffset) {
  let minutes = [];
  users.forEach(function (user) {
    let userOffset = moment.tz(user.time_zone).utcOffset();
    let diffInMinutes = serverOffset - userOffset;
    let res;
    if (time === "Morning") {
      res = user.morning_time.split(":");
    } else {
      res = user.evening_time.split(":");
    }
    minutes.push((Number(res[1]) + (diffInMinutes % 60)) % 60);
  });
  return minutes;
};

const createRule = function (hour, minute) {
  let rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
  rule.hour = hour;
  rule.minute = minute;
  return rule;
};

const sendEmail = function (users, time, serverOffset) {
  let hour = buildHours(users, time, serverOffset);
  let minute = buildMinutes(users, time, serverOffset);
  for (let i = 0; i < users.length; i++) {
    let rule = createRule(hour[i], minute[i]);
    let j = schedule.scheduleJob("User" + i + time, rule, function () {
      console.log(
        "sending email to " +
          users[i].first_name +
          " | " +
          time +
          " | " +
          hour[i] +
          ":" +
          minute[i] +
          " | timezone: " +
          users[i].time_zone +
          " | morning: " +
          users[i].morning_time +
          " | evening: " +
          users[i].evening_time
      );
      console.log();

      users[i].filename = "user-reminder";
      users[i].reminder_type = time;
      send(users[i])
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    });
  }
};

const sendUserEmails = function (users) {
  let servertz = moment.tz.guess();
  let serverOffset = moment.tz(servertz).utcOffset();
  sendEmail(users, "Morning", serverOffset);
  sendEmail(users, "Evening", serverOffset);
};

const sendTeamEmails = function (teams) {
  let servertz = moment.tz.guess();
  let serverOffset = moment.tz(servertz).utcOffset();
  let hour = buildHours(teams.teams, "Evening", serverOffset);
  let minute = buildMinutes(teams.teams, "Evening", serverOffset);
  for (let i = 0; i < teams.teams.length; i++) {
    let rule = createRule(hour[i], minute[i]);
    let j = schedule.scheduleJob(
      "Team" + teams.teams[i].team_id,
      rule,
      function () {
        console.log(
          "sending team update email to " +
            teams.teams[i].team_name +
            " time: " +
            hour[i] +
            ":" +
            minute[i] +
            " | timezone: " +
            teams.teams[i].time_zone +
            " | original time: " +
            teams.teams[i].evening_time
        );
        for (let j = 0; j < teams.teams[i].members.length; j++) {
          teams.teams[i].filename = "team-summary";
          teams.teams[i].reminder_type = "Team Summary";
          teams.teams[i].email = teams.teams[i].members[j].email;
          send(teams.teams[i])
            .then((res) => {})
            .catch((err) => {
              console.log(err);
            });
        }
      }
    );
  }
};

const cancelJobs = function () {
  const jobNames = _.keys(schedule.scheduledJobs);
  for (let name of jobNames) {
    if (name.includes("User") || name.includes("Team")) {
      schedule.cancelJob(name);
    }
  }
};

//midnight and midday '0 0,12 * * *'
//execute every 15 seconds '*/15 * * * * *'
const biDailyUpdate = async function () {
  Team.teamEmailSummary()
    .then((teams) => {
      sendTeamEmails(teams);
    })
    .catch((err) => {
      console.log(err);
    });

  User.getAllEmailTimesForUsers()
    .then((users) => {
      sendUserEmails(users);
    })
    .catch((err) => {
      console.log(err);
    });

  let j = schedule.scheduleJob("Update", "0 0,12 * * *", function () {
    console.log("Bi Daily Update - Executing");
    let date = new Date();
    console.log(date);

    cancelJobs();
    User.getAllEmailTimesForUsers()
      .then((users) => {
        sendUserEmails(users);
      })
      .catch((err) => {
        console.log(err);
      });

    Team.teamEmailSummary()
      .then((teams) => {
        sendTeamEmails(teams);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const send = async function (options) {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);
  let mailOptions = {
    from: "Goals For Today Email Reminder <goalsfortoday@outlook.com>",
    to: options.email,
    subject: "Goals For Today " + options.reminder_type + " Reminder",
    html: html,
    text: text,
  };

  return transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  send,
  sendEmail,
  biDailyUpdate,
  sendUserEmails,
  cancelJobs,
  buildHours,
  buildMinutes,
  sendTeamEmails,
  createRule,
};
