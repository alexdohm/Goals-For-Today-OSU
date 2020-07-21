const express = require("express");
const router = express.Router();
const Team = require("../models/teamModel");
const Helpers = require("../handlers/helpers");

const MISSING_ATTRIBUTE_TEXT =
  "The request object is missing at least one of the required attributes";
const NOT_FOUND_TEXT = "No team with provided team_id exists";
let failedResponseMatch = new Map();
failedResponseMatch.set(
  "400",
  "The request object is missing at least one of the required attributes"
);
failedResponseMatch.set("403", "Provided team name is already used");
failedResponseMatch.set("404", "No team found");

/* ------------- Begin Controller Functions ------------- */

/**********************************************************************
 * GET all teams in the system
 *********************************************************************/
router.get("/", function (req, res) {
  Team.getAllTeams(req)
    .then((teams) => {
      if (teams) {
        // format returned teams
        teams.items = Helpers.addSelf(req, teams.items, "team");
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
 * GET a team by team_id
 *********************************************************************/
router.get("/:team_id", function (req, res) {
  Team.getTeamById(req.params.team_id)
    .then((team) => {
      if (failedResponseMatch.get(team)) {
        res
          .status(Number(team))
          .json({ Error: `${failedResponseMatch.get(team)}` });
      } else {
        team.self = Helpers.addSelf(req, team.team_id, "teams");
        res.status(200).json(team);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message }).end();
    });
});

/**********************************************************************
 * POST add a goal
 *********************************************************************/
router.post("/", async function (req, res) {
  if (req.body.name && req.body.date) {
    Team.addTeam(req.body.name, req.body.date)
      .then((newTeam) => {
        newTeam.self = Helpers.addSelf(req, newTeam.team_id, "teams");
        res.status(201).json(newTeam);
      })
      .catch((err) => {
        console.log(err);
        if (err.constraint) {
          res
            .status(403)
            .json({ Error: `${failedResponseMatch.get("403")}` })
            .end();
        } else {
          res.status(500).json({ Error: err.message });
        }
      });
  } else {
    res.status(400).json({ Error: MISSING_ATTRIBUTE_TEXT }).end();
  }
});

/**********************************************************************
 * PATCH modify a team
 *********************************************************************/
router.patch("/:team_id", async function (req, res) {
  if (
    req.body.team_name ||
    req.body.evening_time ||
    req.body.time_zone ||
    req.body.date_created
  ) {
    Team.updateTeam(req.params.team_id, req.body)
      .then((t) => {
        if (failedResponseMatch.get(t)) {
          res
            .status(Number(t))
            .json({ Error: `${failedResponseMatch.get(t)}` });
        } else {
          t.self = Helpers.addSelf(req, req.params.team_id, "teams");
          res.status(200).json(t).end();
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ Error: err.message });
      });
  } else {
    res.status(400).json({ Error: MISSING_ATTRIBUTE_TEXT }).end();
  }
});

/**********************************************************************
 * GET all members of a team
 *********************************************************************/
router.get("/:team_id/users", function (req, res) {
  Team.getAllUsersOnTeam(req.params.team_id)
    .then((teamMembers) => {
      if (teamMembers) {
        // format returned teams
        teamMembers.items = Helpers.addSelf(req, teamMembers.items, "user");
      }
      // return regardless if teams were found
      res.status(200).json(teamMembers);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message }).end();
    });
});

/**********************************************************************
 * DELETE a team
 *********************************************************************/
router.delete("/:team_id", async function (req, res) {
  Team.deleteTeam(req.params.team_id)
    .then((t) => {
      if (failedResponseMatch.get(t)) {
        res.status(Number(t)).json({ Error: `${failedResponseMatch.get(t)}` });
      } else {
        res.status(204).end();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message });
    });
});

/* ------------- End Controller Functions ------------- */
module.exports = router;
