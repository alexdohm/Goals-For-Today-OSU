const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Goal = require("../models/goalModel");
const Helpers = require("../handlers/helpers");

const MISSING_ATTRIBUTE_TEXT =
  "The request object is missing at least one of the required attributes";

let failedResponseMatch = new Map();
failedResponseMatch.set(
  "400",
  "The request object is missing at least one of the required attributes"
);
failedResponseMatch.set("404", "No goal found");

/**********************************************************************
 * GET all goals for a user
 *********************************************************************/
router.get("/teams/:team_id/users/:member_id", function (req, res) {
  // TODO parameter checking
  Goal.getAllGoalsForUser(req.params.member_id, req.params.team_id)
    .then((goals) => {
      // TODO result checking
      res.status(200).json(goals);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message });
    });
});

/**********************************************************************
 * GET all comments for a goal
 *********************************************************************/
router.get("/:goal_id/comments", function (req, res) {
  Goal.getAllCommentsOnGoal(req.params.goal_id)
    .then((goals) => {
      // TODO result checking
      if (goals.number_of_items) {
        goals.items = Helpers.addSelf(req, goals.items, "comments");
      }
      res.status(200).json(goals);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message });
    });
});

/**********************************************************************
 * POST add a comment to a goal
 *********************************************************************/
router.post("/:goal_id/comments", async function (req, res) {
  if (
    req.body.author &&
    req.body.team_id &&
    req.body.comment_date &&
    req.body.comment_text
  ) {
    Goal.addGoalComment(
      req.body.team_id,
      req.body.author,
      req.params.goal_id,
      req.body.comment_text,
      req.body.comment_date
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
 * GET a goal by goal_id
 *********************************************************************/
router.get("/:goal_id", function (req, res) {
  Goal.getGoalById(req.params.goal_id)
    .then((goal) => {
      if (failedResponseMatch.get(goal)) {
        res
          .status(Number(goal))
          .json({ Error: `${failedResponseMatch.get(goal)}` });
      } else {
        goal.self = Helpers.addSelf(req, goal.goal_id, "goals");
        res.status(200).json(goal);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message });
    });
});

/**********************************************************************
 * POST add a goal
 *********************************************************************/
router.post("/", async function (req, res) {
  if (
    req.body.name &&
    req.body.description &&
    req.body.create_date &&
    req.body.team_id &&
    req.body.member_id
  ) {
    Goal.addGoal(
      req.body.team_id,
      req.body.member_id,
      req.body.name,
      req.body.description,
      req.body.create_date
    )
      .then((newGoal) => {
        newGoal.self = Helpers.addSelf(req, newGoal.goal_id, "goals");
        res.status(201).json(newGoal);
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
 * PATCH modify a goal
 *********************************************************************/
router.patch("/:goal_id", async function (req, res) {
  if (req.body.name || req.body.description || req.body.status) {
    Goal.updateGoal(req.params.goal_id, req.body)
      .then((g) => {
        if (failedResponseMatch.get(g)) {
          res
            .status(Number(g))
            .json({ Error: `${failedResponseMatch.get(g)}` });
        } else {
          g.self = Helpers.addSelf(req, req.params.goal_id, "goals");
          res.status(200).json(g).end();
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
 * DELETE a goal
 *********************************************************************/
router.delete("/:goal_id", async function (req, res) {
  Goal.deleteGoal(req.params.goal_id)
    .then((g) => {
      if (failedResponseMatch.get(g)) {
        res.status(Number(g)).json({ Error: `${failedResponseMatch.get(g)}` });
      } else {
        res.status(204).end();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Error: err.message });
    });
});

module.exports = router;
