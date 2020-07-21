/*
 * commentModel.js
 * Functions to handle interactions between data model and returned data
 */
const Helpers = require("../handlers/helpers");

const addComment = async function (commentInfoObject) {
  //TODO implement
};

/**
 * Builds query and filters based on what type of comment is requested.
 * @param {string} entityType what the comment is on: USER, GOAL, TEAM
 * @param {*} entityObj object containing parameters required for the comment type
 */
const getAllCommentsForEntity = async function (entityType, entityObj) {
  let entityQuery;
  let filters = [];

  switch (entityType) {
    case "GOAL":
      entityQuery = `SELECT c.comment_id, c.date_time::time, c.message, tm.first_name, tm.last_name, tm.avatar
                                    FROM team_member AS tm
                                            INNER JOIN goal AS g ON g.member_id = tm.member_id
                                            INNER JOIN comment as c on c.goal_id = g.goal_id
                                    WHERE g.goal_id = $1;`;
      filters.push(entityObj.goal_id);
      break;
    case "USER":
      entityQuery = `SELECT c.comment_id, c.date_time::time, c.message, tm.first_name, tm.last_name, tm.avatar
                                FROM team_member AS tm
                                        INNER JOIN comment as c on c.member_id = tm.member_id
                                WHERE c.goal_id IS NULL
                                AND DATE(c.date_time) = $1
                                AND c.member_id = $2
                                AND c.team_id = $3
                                AND c.team_page = false;`;
      filters.push(entityObj.date, entityObj.member_id, entityObj.team_id);
      break;
    case "TEAM":
      entityQuery = `SELECT c.comment_id, c.date_time::time, c.message, tm.first_name, tm.last_name, tm.avatar
                                FROM team_member AS tm
                                        INNER JOIN comment as c on c.member_id = tm.member_id
                                WHERE c.goal_id IS NULL
                                AND DATE(c.date_time) = $1
                                AND c.team_id = $2
                                AND c.team_page = true;`;
      filters.push(entityObj.date, entityObj.team_id);
      break;
  }

  return Helpers.runQuery(entityQuery, filters);
};

module.exports = { addComment, getAllCommentsForEntity };
