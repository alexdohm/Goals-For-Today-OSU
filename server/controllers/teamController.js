const express = require("express");
const router = express.Router();
const Team = require("../models/teamModel");
const TeamStats = require("../models/teamStatisticsModel");
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
 * POST add a team
 *********************************************************************/
router.post("/", async function (req, res) {
  if (req.body.name && req.body.date) {
    Team.addTeam(req.body.name, req.body.date, req.body.member_id)
      .then((newTeam) => {
        newTeam.self = Helpers.addSelf(req, newTeam.team_id, "teams");
        res.status(201).json(newTeam);
      })
      .catch((err) => {
        console.log(err);
        if (err.constraint) {
          const reason =
            err.constraint === "member_of_member_id_fkey"
              ? `Member with member_id ${req.body.member_id} does not exist.`
              : failedResponseMatch.get("403");
          res
            .status(403)
            .json({
              Error: reason,
              Detail: err.detail,
            })
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
        teamMembers.items = Helpers.addSelf(req, teamMembers.items, "users");
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
 * GET all non-members of a team
 *********************************************************************/
router.get("/:team_id/non_members", function (req, res) {
  Team.getUsersNotInTeam(req.params.team_id)
    .then((teamMembers) => {
      if (teamMembers) {
        // format returned teams
        teamMembers.items = Helpers.addSelf(req, teamMembers.items, "users");
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

/**********************************************************************
 * POST add a comment to a team
 *********************************************************************/
router.post("/:team_id/comments", async function (req, res) {
  if (req.body.author && req.body.comment_date && req.body.comment_text) {
    Team.addTeamComment(
      req.params.team_id,
      req.body.author,
      req.body.comment_date,
      req.body.comment_text
    )
      .then((newComment) => {
        newComment.self = Helpers.addSelf(
          req,
          newComment.comment_id,
          "comments"
        );
        res.status(201).json(newComment);
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
 * GET all comments for a team
 *********************************************************************/
router.get("/:team_id/comments", function (req, res) {
  Team.getAllTeamComments(req.params.team_id)
    .then((data) => {
      res.status(200).json(data).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message });
    });
});

/**********************************************************************
 * PUT add a user to a team/user requests to join team
 *********************************************************************/
router.put("/:team_id/users/:user_id", async function (req, res) {
  if (!req.body.date_added) {
    res.status(400).json({ Error: MISSING_ATTRIBUTE_TEXT }).end();
  } else {
    Team.addUserToTeam(req.params.team_id, req.params.user_id, req.body)
      .then((t) => {
        if (failedResponseMatch.get(t)) {
          res
            .status(Number(t))
            .json({ Error: `${failedResponseMatch.get(t)}` });
        } else {
          res.status(204).end();
        }
      })
      .catch((err) => {
        if (err.constraint === "member_of_team_id_fkey") {
          // team id doesn't exist
          res.status(404).json({ Error: `${failedResponseMatch.get("404")}` });
        } else if (err.constraint === "member_of_member_id_fkey") {
          // member id doesn't exist
          res
            .status(404)
            .json({ Error: "No team member with member id found" })
            .end();
        } else if (err.constraint === "member_of_pkey") {
          // member is already on team
          // PUT is idempotent so if they violate a constraint they are already on the team
          // so just send back success
          res.status(204).end();
        } else {
          console.log(err);
          res.status(500).json({ Error: err.message });
        }
      });
  }
});

/**********************************************************************
 * PATCH admin approves user request to join team and/or adds another team admin
 *********************************************************************/
router.patch("/:team_id/users/:user_id", async function (req, res) {
  if (!req.body.approved_ind && req.body.admin_ind === undefined) {
    res.status(400).json({ Error: MISSING_ATTRIBUTE_TEXT }).end();
  } else {
    if (req.body.approved_ind) {
      Team.approveUserRequest(req.params.user_id, req.params.team_id)
        .then((t) => {
          if (failedResponseMatch.get(t)) {
            res
              .status(Number(t))
              .json({ Error: `${failedResponseMatch.get(t)}` });
          } else {
            if (!t) {
              res.status(500).json({ Error: "FAILED TO UPDATE" });
            }
            res.status(204).end();
          }
        })
        .catch((err) => {
          console.log(err);

          if (err.constraint) {
            res.status(204).end();
          } else {
            res.status(500).json({ Error: err.message });
          }
        });
    } else if (req.body.admin_ind !== undefined) {
      Team.updateTeamAdmin(req.params.user_id, req.params.team_id, req.body)
        .then((t) => {
          res.status(204).json().end();
        })
        .catch((err) => {
          console.log(err);

          res.status(500).json({ Error: err.message });
        });
    }
  }
});

/**********************************************************************
 * Remove pending request from team
 *********************************************************************/
router.delete("/:team_id/users/:user_id/pending", async function (req, res) {
  Team.removePendingTeamMember(req.params.user_id, req.params.team_id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message });
    });
});

/**********************************************************************
 * Remove a user from a team
 *********************************************************************/
router.delete("/:team_id/users/:user_id", async function (req, res) {
  Team.removeTeamMember(req.params.user_id, req.params.team_id, req.query.date)
    .then((t) => {
      if (!t) {
        console.log(
          `NOTHING UPDATED FOR PARAMS ${req.params.user_id}, ${req.params.team_id}, ${req.query.date}`
        );
      }
      res.status(204).end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message });
    });
});

/**********************************************************************
 * Get statistics for a team
 *********************************************************************/
router.get("/:team_id/statistics", function (req, res) {
  TeamStats.getAllTeamStats(
    req.params.team_id,
    req.query.beginDate,
    req.query.endDate
  )
    .then((stats) => {
      res.status(200).json(stats);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message }).end();
    });
});

/* ------------- End Controller Functions ------------- */
module.exports = router;
