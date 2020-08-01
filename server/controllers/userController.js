const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Helpers = require("../handlers/helpers");
const User = require("../models/userModel");

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
 * GET a user by email OR member_id
 *********************************************************************/
router.get("/:identifier", function (req, res) {
  if (req.query.type === "id" || !isNaN(req.params.identifier)) {
    User.getUserById(req.params.identifier)
      .then((result) => {
        //console.log(result)
        if (failedResponseMatch.get(result)) {
          res
            .status(Number(result))
            .json({ Error: `${failedResponseMatch.get(result)}` });
        } else {
          result.self = Helpers.addSelf(req, result.member_id, "users");
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ Error: err.message }).end();
      });
  } else if (req.query.type === "email") {
    User.getUserByEmail(req.params.identifier)
      .then((result) => {
        if (failedResponseMatch.get(result)) {
          res
            .status(Number(result))
            .json({ Error: `${failedResponseMatch.get(result)}` });
        } else {
          result.self = Helpers.addSelf(req, result.member_id, "users");
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ Error: err.message }).end();
      });
  } else {
    res.status("400").json({ Error: "No type defined to get user by" }).end();
  }
});

/**********************************************************************
 * GET dataset for a user upon login
 *********************************************************************/
router.get("/login/:email/team_id/:team_id", function (req, res) {
  User.loadUserInfoOnLogin(req.params.email, req.params.team_id)
    .then((data) => {
      res.status(200).json(data).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message });
    });
});

/**********************************************************************
 * GET all team info when a user switches teams in settings page
 *********************************************************************/
router.get("/:user_id/load_team/:team_id", function (req, res) {
  User.getUserTeamGoalsComments(req.params.user_id, req.params.team_id)
    .then((data) => {
      res.status(200).json(data).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message });
    });
});

/**********************************************************************
 * GET all teams user is not a member of
 *********************************************************************/
router.get("/:user_id/non_members", function (req, res) {
  User.getNonTeamsForUser(req.params.user_id)
    .then((teams) => {
      if (teams) {
        // format returned teams
        teams.items = Helpers.addSelf(req, teams.items, "teams");
      }
      // return regardless if teams were found
      res.status(200).json(teams);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message }).end();
    });
});

/**********************************************************************
 * GET all general comments for a user
 *********************************************************************/
router.get("/:user_id/teams/:team_id/comments", function (req, res) {
  User.getUserComments(req.params.user_id, req.params.team_id)
    .then((data) => {
      res.status(200).json(data).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message });
    });
});

/**********************************************************************
 * POST add general user comment
 *********************************************************************/
router.post("/:user_id/comments", async function (req, res) {
  if (req.body.author && req.body.comment_text && req.body.comment_date) {
    User.addUserComment(
      req.body.team_id,
      req.params.user_id,
      req.body.author,
      req.body.comment_text,
      req.body.comment_date
    )
      .then((c) => {
        c.self = Helpers.addSelf(req, c.comment_id, "comments");
        res.status(201).json(c).end();
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
 * GET all users
 *********************************************************************/
router.get("/", function (req, res) {
  User.getAllUsers()
    .then((users) => {
      users.items = Helpers.addSelf(req, users.items, "users");
      res.status(200).json(users).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message });
    });
});

/**********************************************************************
 * POST add a user
 *********************************************************************/
router.post("/", async function (req, res) {
  if (
    req.body.first_name &&
    req.body.last_name &&
    req.body.email &&
    req.body.password
  ) {
    User.addUser(
      req.body.first_name,
      req.body.last_name,
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
 * PATCH modify a user
 *********************************************************************/
router.patch("/:user_id", async function (req, res) {
  if (
    req.body.firstName ||
    req.body.lastName ||
    req.body.email ||
    req.body.password ||
    req.body.morning_time ||
    req.body.evening_time ||
    req.body.time_zone ||
    req.body.verified ||
    req.body.username
  ) {
    User.updateUser(req.params.user_id, req.body)
      .then((u) => {
        if (failedResponseMatch.get(u)) {
          res
            .status(Number(u))
            .json({ Error: `${failedResponseMatch.get(u)}` });
        } else {
          u.self = Helpers.addSelf(req, req.params.user_id, "users");
          delete u.member_password;
          res.status(200).json(u).end();
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err.message);
      });
  } else {
    res.status(400).json({ Error: MISSING_ATTRIBUTE_TEXT }).end();
  }
});

/**********************************************************************
 * GET all teams for a user
 *********************************************************************/
router.get("/:user_id/teams", function (req, res) {
  User.getAllTeamsForUser(req.params.user_id)
    .then((result) => {
      if (failedResponseMatch.get(result)) {
        res
          .status(Number(result))
          .json({ Error: `${failedResponseMatch.get(result)}` });
      } else {
        result.items = Helpers.addSelf(req, result.items, "teams");
        res.status(200).json(result);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message }).end();
    });
});

/**********************************************************************
 * GET all pending team requests for a user
 *********************************************************************/
router.get("/:user_id/pending", function (req, res) {
  User.getUserPendingRequests(req.params.user_id)
    .then((pendingInvites) => {
      if (failedResponseMatch.get(pendingInvites)) {
        res
          .status(Number(pendingInvites))
          .json({ Error: `${failedResponseMatch.get(pendingInvites)}` });
      } else {
        pendingInvites.self = Helpers.addSelf(req, req.params.user_id, "users");
        res.status(200).json(pendingInvites);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message }).end();
    });
});

/**********************************************************************
 * DELETE a user
 *********************************************************************/
router.delete("/:member_id", function (req, res) {
  if (!isNaN(req.params.member_id) && req.query.date) {
    User.deleteUser(req.params.member_id, req.query.date)
      .then((result) => {
        if (result) {
          res.status(204).end();
        } else {
          res
            .status(500)
            .json({
              Error: "Issue occured while updating rows. Please see logs.",
            })
            .end();
        }
      })
      .catch((err) => {
        if (err.name === "SOLE_ADMIN") {
          res.status(err.status).json(err).end();
        } else {
          console.log(err);
          res.status(500).json({ Error: err.message }).end();
        }
      });
  } else {
    res.status(400).json({ Error: "Bad request." }).end();
  }
});

module.exports = router;
