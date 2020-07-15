const express = require("express");
const app = express();
var session = require("express-session"); //
const path = require(`path`);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // not needed
app.enable("trust proxy");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
app.get("/team_overview", function (req, res) {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.get("/settings", function (req, res) {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.get("/create_account", function (req, res) {
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
