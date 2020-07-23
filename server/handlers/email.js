const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
let schedule = require("node-schedule");
const _ = require("lodash");
const moment = require("moment");
const User = require("../models/userModel");

let transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secureConnection: false,
  pool: true,
  maxConnections: 3,
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

const sendEmail = async function (users, time, serverOffset) {
  let hour = buildHours(users, time, serverOffset);
  let minute = buildMinutes(users, time, serverOffset);
  for (let i = 0; i < users.length; i++) {
    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [1, 2, 3, 4, 5];
    rule.hour = hour[i];
    rule.minute = minute[i];

    let j = schedule.scheduleJob("User" + i + time, rule, function () {
      console.log("sending email to " + users[i].first_name + " | " + time);
      users[i].filename = "user-reminder";
      users[i].reminder_type = time;
      send(users[i])
        .then((res) => {})
        .catch((err) => {});
    });
  }
};

const sendUserEmails = function (users) {
  let servertz = moment.tz.guess();
  let serverOffset = moment.tz(servertz).utcOffset();

  sendEmail(users, "Morning", serverOffset)
    .then((res) => {})
    .catch((err) => {});
  sendEmail(users, "Evening", serverOffset)
    .then((res) => {})
    .catch((err) => {});
};

const cancelJobs = function () {
  const jobNames = _.keys(schedule.scheduledJobs);
  for (let name of jobNames) {
    if (name.includes("User")) {
      schedule.cancelJob(name);
    }
  }
};

//midnight and midday '0 0 0,12 * *'
const biDailyUpdate = async function () {
  let j = schedule.scheduleJob("Update", "*/15 * * * * *", function () {
    console.log("Bi Daily Update - Executing");
    cancelJobs();
    User.getAllEmailTimesForUsers()
      .then((users) => {
        sendUserEmails(users);

        // keeping this here in case there is an issue with too many requests at once with outlook
        // users.forEach(function (userItem) {
        //   setTimeout(function () {
        //     //timeout if for concurrent connections at same time...outlook doesn't like this
        //     userItem.filename = "user-reminder";
        //     userItem.reminder_type = "Morning";
        //     send(userItem)
        //       .then((res) => {})
        //       .catch((err) => {});
        //   }, 1000);
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
};
