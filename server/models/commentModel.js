/*
 * commentModel.js
 * Functions to handle interactions between data model and returned data
 */
const Helpers = require("../handlers/helpers");

const addComment = async function (entityType, entityObj) {
  let commentInsert;
  let filter = [];
  switch (entityType) {
    case "GOAL":
      commentInsert = `INSERT INTO comment (member_id, team_id, goal_id, team_page, date_time, message)
    VALUES ($1, $2, $3, false, $4, $5) RETURNING comment_id;
      `;
      filter.push(
        entityObj.member_id,
        entityObj.team_id,
        entityObj.goal_id,
        entityObj.date,
        entityObj.message
      );
      break;
    case "USER":
      commentInsert = `INSERT INTO comment (member_id, team_id, team_page, date_time, message)
      VALUES ( $1, $2, false, $3, $4) RETURNING comment_id;`;

      filter.push(
        entityObj.member_id,
        entityObj.team_id,
        entityObj.date,
        entityObj.message
      );
      break;
    case "TEAM":
      commentInsert = `INSERT INTO comment (member_id, team_id, team_page, date_time, message)
              VALUES ($1, $2, true, $3, $4) RETURNING comment_id;`;

      filter.push(
        entityObj.member_id,
        entityObj.team_id,
        entityObj.date,
        entityObj.message
      );
      break;
  }

  const newCommentId = await Helpers.insertData(
    commentInsert,
    filter,
    "comment_id"
  );

  return await getCommentById(newCommentId);
};
/**
 * Return a comment and metadata based on unique comment id
 * @param {number} commentId  unique id of comment
 */
const getCommentById = async function (commentId) {
  const commentQuery = `SELECT c.comment_id, c.date_time::time, c.message, tm.first_name, tm.last_name, tm.avatar
  FROM team_member AS tm
           INNER JOIN comment as c on c.member_id = tm.member_id
  WHERE c.comment_id = $1;`;

  const commentReturned = await Helpers.runQuery(commentQuery, [commentId]);

  if (!commentReturned) {
    return "404";
  }

  return commentReturned[0];
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
