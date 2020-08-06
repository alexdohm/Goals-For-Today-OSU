const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Helpers = require("../handlers/helpers");
const jwt = require("jsonwebtoken");

const jwtKey = "my_secret_key";
const jwtExpirySeconds = 300;

const MISSING_ATTRIBUTE_TEXT =
  "The request object is missing at least one of the required attributes";

let failedResponseMatch = new Map();
failedResponseMatch.set(
  "400",
  "The request object is missing at least one of the required attributes"
);
failedResponseMatch.set("403", "Provided email address is already registered");
failedResponseMatch.set("404", "No user found");

/**********************************************************************
 * POST register a new user
 *********************************************************************/
router.post("/signup", function (req, res) {
  if (
    req.body.firstName &&
    req.body.lastName &&
    req.body.email &&
    req.body.password
  ) {
    User.addUser(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.password,
      req
    )
      .then((newUser) => {
        if (failedResponseMatch.get(newUser)) {
          res
            .status(Number(newUser))
            .json({ Error: `${failedResponseMatch.get(newUser)}` });
        } else {
          newUser.self = Helpers.addSelf(req, newUser.member_id, "users");

          res.status(201).json(newUser);
        }
      })
      .catch((err) => {
        console.log(err);
        // database throws an error because of constraint and populates which one is violated.
        // Catch it and send proper response status & message
        if (err.constraint) {
          res.status(403).json({ Error: `${failedResponseMatch.get("403")}` });
        } else {
          res.status(500).json({ Error: err.message });
        }
      });
  } else {
    res.status(400).json({ Error: MISSING_ATTRIBUTE_TEXT }).end();
  }
});

/**********************************************************************
 * POST log in an existing user
 *********************************************************************/
router.post("/login", function (req, res) {
  User.getUser(req.body.emailInput, req.body.passwordInput)
    .then((user) => {
      if (failedResponseMatch.get(user)) {
        res
          .status(Number(user))
          .json({ Error: `${failedResponseMatch.get(user)}` });
      } else {
        const token = jwt.sign({ user }, jwtKey, {
          algorithm: "HS256",
          //expiresIn: jwtExpirySeconds,
        });
        //console.log("token:", token);

        // set the cookie as the token string, with a similar max age as the token
        // here, the max age is in milliseconds, so we multiply by 1000
        // https://dev.to/mr_cea/remaining-stateless-jwt-cookies-in-node-js-3lle
        res.cookie("token", token);
        res.status(200);
        res.send(token);
        res.end();
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(404)
        .json({ Error: `${failedResponseMatch.get("404")}` })
        .end();
    });
});

module.exports = router;
