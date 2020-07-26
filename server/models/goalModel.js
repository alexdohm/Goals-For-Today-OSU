/*
 * goalModel.js
 * Functions to handle interactions between data model and returned data
 */
const Helpers = require("../handlers/helpers");
const Comment = require("./commentModel");

/**
 *
 * @param {number} teamId unique id of team
 * @param {number} userId unique id of user
 * @param {string} name name of task from user
 * @param {string} description description from user
 * @param {date} createDate date goal was enteredd
 */
const addGoal = async function (teamId, userId, name, description, createDate) {
  const goalQuery = `INSERT INTO goal (team_id, member_id, task_name, task_description, date_time)
   VALUES ($1,$2, $3, $4, $5) RETURNING goal_id;`;

  const filter = [teamId, userId, name, description, createDate];

  const newId = await Helpers.insertData(goalQuery, filter, "goal_id");

  return getGoalById(newId);
};

/**
 * Return all goal fields from goal table
 * @param {number} goalId
 */
const getGoalById = async function (goalId) {
  const goalQuery = `SELECT * FROM goal WHERE goal_id = $1;`;

  const filter = [goalId];

  const goal = await Helpers.runQuery(goalQuery, filter);

  if (goal) {
    return goal[0];
  } else {
    return "404";
  }
};

/**
 * Return all goal fields from goal table
 * @param {number} goalId
 */
const getAllCommentsOnGoal = async function (goalId) {
  const goalObj = {};
  goalObj.goal_id = goalId;
  const goalComments = await Comment.getAllCommentsForEntity("GOAL", goalObj);

  if (goalComments) {
    return {
      number_of_items: goalComments.length || 0,
      items: [...goalComments] || [],
    };
  } else {
    return {
      number_of_items: 0,
      items: [],
    };
  }
};

/**
 * Add a new comment to a goal
 * @param {number} teamId unique id of team
 * @param {number} userId unique id of author of comment
 * @param {number} goalId unique id of goal that is being commented on
 * @param {string} comment_text text of comment
 * @param {date} comment_date date of comment
 */
const addGoalComment = async function (
  teamId,
  userId,
  goalId,
  comment_text,
  comment_date
) {
  const goalComment = {
    member_id: userId,
    team_id: teamId,
    goal_id: goalId,
    date: comment_date,
    message: comment_text,
  };

  return Comment.addComment("GOAL", goalComment);
};

/**
 * Get all goals and comments on those goals for a user
 * @param {date} date
 * @param {number} memberId
 * @param {number} teamId
 */
const getAllGoalsForUser = async function (memberId, teamId) {
  //    --list of goals for user [ need member_id, team_id and date]
  const goalQuery = `SELECT goal_id, task_name, task_description, date_time, status
        FROM goal
        WHERE member_id = $1
        AND team_id = $2;`;

  const filters = [memberId, teamId];

  const goalList = await Helpers.runQuery(goalQuery, filters);

  // see how many we got back, get comments if any
  if (goalList.length) {
    for (goal of goalList) {
      goal.comments = [];
      const c = await Comment.getAllCommentsForEntity("GOAL", {
        goal_id: goal.goal_id,
      });

      if (c.length) {
        goal.comments = [...c];
      }
    }
  }
  if (goalList.length) {
    return {
      number_of_items: goalList.length,
      items: [...goalList],
    };
  } else {
    return {
      number_of_items: 0,
      items: [],
    };
  }
};
/**
 * update an existing goal
 * @param {number} goalId unique id of existing goal
 * @param {object} goalInfo object with new goal attributes
 */
const updateGoal = async function (goalId, goalInfo) {
  // get existing goal
  const existingGoal = await Helpers.runQuery(
    "SELECT * FROM goal WHERE goal_id = $1;",
    [goalId]
  );

  if (!existingGoal) {
    return "404";
  }

  const updatedGoal = {
    task_name: goalInfo.name || existingGoal[0].task_name,
    task_description: goalInfo.description || existingGoal[0].task_description,
    status: goalInfo.status || existingGoal[0].status,
  };

  const updatedGoalQuery = `UPDATE goal SET task_name = $1,
  task_description = $2, status = $3 WHERE goal_id = $4`;

  const updatedGoalInd = await Helpers.updateData(updatedGoalQuery, [
    updatedGoal.task_name,
    updatedGoal.task_description,
    updatedGoal.status,
    goalId,
  ]);

  return getGoalById(goalId);
};
/**
 * delete an existing goal
 * @param {number} goalId unique id of goal to be deleted
 */
const deleteGoal = async function (goalId) {
  const deleteGoalQuery = `DELETE FROM goal WHERE goal_id = $1`;

  const deleteResult = await Helpers.deleteData(deleteGoalQuery, [goalId]);

  console.log(deleteResult);

  return deleteResult;
};

module.exports = {
  addGoal,
  getAllGoalsForUser,
  updateGoal,
  deleteGoal,
  getGoalById,
  getAllCommentsOnGoal,
  addGoalComment,
};
