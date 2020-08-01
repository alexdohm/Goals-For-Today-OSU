/*
 * teamModel.js
 * Functions to handle interactions between data model and returned data
 */
const Helpers = require("../handlers/helpers");
const Comment = require("./commentModel");
const moment = require("moment");
moment().format();

const getAllTeams = async function () {
  const allTeamQuery = `SELECT team_id, team_name
  from team
  ORDER BY team_name ASC;`;

  const allTeams = await Helpers.runQuery(allTeamQuery, []);

  if (allTeams) {
    const teamJson = {};
    teamJson.number_of_items = allTeams.length;
    teamJson.items = [...allTeams];

    return teamJson;
  } else {
    return {
      number_of_items: 0,
      items: [],
    };
  }
};

/**
 * Get single team by team_id. Returns 404 if no match
 * @param {number} teamId unique id of team
 */
const getTeamById = async function (teamId) {
  const team = await Helpers.runQuery(
    "SELECT * from team WHERE team_id = $1; ",
    [teamId]
  );

  if (team) {
    return team[0];
  } else {
    return "404";
  }
};
/**
 *
 * @param {string} name Unique name of team
 * @param {date} date date team was created
 * @param {date} member unique id of team member who created team
 */
const addTeam = async function (name, date, member) {
  const newTeamQuery = `INSERT INTO team (team_name, date_created)
  VALUES ($1, $2)
  returning team_id;`;

  const filter = [name, date];

  const newTeamId = await Helpers.insertData(newTeamQuery, filter, "team_id");

  // now add user to team
  const addResult = await addUserToTeam(newTeamId, member, {
    approved_ind: 1,
    date_added: date,
  });

  // set them as admin
  const adminResult = await updateTeamAdmin(member, newTeamId, {
    admin_ind: 1,
  });
  // return new team info
  return getTeamById(newTeamId);
};
/**
 * Update an existing team
 * @param {number} teamId
 * @param {object} teamInfoObject
 */
const updateTeam = async function (teamId, teamInfoObject) {
  const existingTeam = await getTeamById(teamId);

  if (existingTeam === "404") {
    return existingTeam;
  }

  const updatedTeam = {
    team_name: teamInfoObject.name || existingTeam.team_name,
    evening_time: teamInfoObject.evening_time || existingTeam.evening_time,
    time_zone: teamInfoObject.time_zone || existingTeam.time_zone,
    date_created:
      teamInfoObject.date_created || moment(existingTeam.date_created).format(),
  };

  const filter = [
    `${updatedTeam.team_name}`,
    `${updatedTeam.evening_time}`,
    `${updatedTeam.time_zone}`,
    `${updatedTeam.date_created}`,
    teamId,
  ];

  const updateQuery = `UPDATE team 
  SET team_name = $1, 
     evening_time = $2, 
     time_zone = $3, 
     date_created = $4
  WHERE team_id = $5
  RETURNING * `;

  return Helpers.updateData(updateQuery, filter);
};

/**
 * Deletes a team from the database
 * Database cascade handles associated members, goals, and comments
 * @param {number} teamId unique id of team to delete
 */
const deleteTeam = async function (teamId) {
  const deleteTeamQuery = `DELETE FROM team WHERE team_id = $1`;

  return Helpers.deleteData(deleteTeamQuery, [teamId]);

  //return deleteResult;
};
/**
 * Add user to a team
 * @param {number} teamId unique team id
 * @param {number} userId unique user id
 * @param {object} body request body with approved status and date
 */
const addUserToTeam = async function (teamId, userId, body) {
  const approved_ind = body.approved_ind ? true : false;

  // check if user is already on team and was previously removed
  const checkTeamQuery =
    "SELECT * FROM member_of WHERE team_id = $1 AND member_id = $2";

  const alreadyOnTeamResult = await Helpers.runQuery(checkTeamQuery, [
    teamId,
    userId,
  ]);

  if (alreadyOnTeamResult && alreadyOnTeamResult[0].date_left) {
    // set date left to null
    const updateTeamUserQuery =
      "UPDATE member_of set date_left = NULL where team_id = $1 AND member_id = $2";

    const updateResult = await Helpers.updateData(updateTeamUserQuery, [
      teamId,
      userId,
    ]);

    return updateResult;
  }

  const addTeamMemberQuery = `INSERT INTO member_of (member_id, team_id, approved, date_added)
    VALUES ($1, $2, $3, $4);`;

  const filter = [userId, teamId, approved_ind, body.date_added];

  const newTeamMember = await Helpers.updateData(addTeamMemberQuery, filter);

  return newTeamMember;
};

/**
 * Update membership status for user
 * @param {number} userId unique id of user
 * @param {number} teamId unique id of team
 */
const approveUserRequest = async function (userId, teamId) {
  const approveQuery = `
    UPDATE member_of
    SET approved = true
    WHERE member_id = $1
      AND team_id = $2;`;

  const filter = [userId, teamId];

  return Helpers.updateData(approveQuery, filter);
};
/**
 * Add or remove a user from the manages table effectively updating admin status
 * @param {number} userId
 * @param {number} teamId
 * @param {objeect} updateInfo if admin_ind = 1, add user to manages table, else remove
 */
const updateTeamAdmin = async function (userId, teamId, updateInfo) {
  let updateStatement;

  if (updateInfo.admin_ind) {
    updateStatement = `INSERT INTO manages (member_id, team_id)
        VALUES ($1, $2);`;
  } else {
    updateStatement = `DELETE
        FROM manages
        WHERE member_id = $1
          AND team_id = $2;`;
  }

  return Helpers.updateData(updateStatement, [userId, teamId]);
};

/**
 * Remove team member from group
 * @param {number} userId
 * @param {number} teamId
 * @param {date} date
 */
const removeTeamMember = async function (userId, teamId, date) {
  const removalQuery = `UPDATE member_of
  SET date_left = $1
  WHERE member_id = $2
    AND team_id = $3;`;

  return Helpers.updateData(removalQuery, [date, userId, teamId]);
};

/**
 * Remove team member from group
 * @param {number} userId
 * @param {number} teamId
 * @param {date} date
 */
const removePendingTeamMember = async function (userId, teamId) {
  const removalQuery = `DELETE from member_of where member_id = $1 and team_id = $2;`;

  return Helpers.updateData(removalQuery, [userId, teamId]);
};

/**
 * Return all users on team and their status (member, admin, requested)
 * @param {number} teamId unique id of team
 */
const getAllUsersOnTeam = async function (teamId) {
  const teamMembersQuery = `SELECT tm.member_id, tm.first_name, tm.last_name, tm.user_name,
  CASE 
        WHEN mo.approved is false THEN 'REQUESTED'
		WHEN m.member_id is null THEN 'MEMBER'
		ELSE 'ADMIN'
	END AS STATUS
    FROM team_member AS tm
             INNER JOIN member_of AS mo ON mo.member_id = tm.member_id
             AND mo.date_left IS NULL
             INNER JOIN team AS t ON t.team_id = mo.team_id
             LEFT JOIN manages m ON tm.member_id = m.member_id and t.team_id = m.team_id
    WHERE t.team_id = $1;`;

  const filter = [teamId];

  const allTeamMembers = await Helpers.runQuery(teamMembersQuery, filter);

  if (allTeamMembers.length) {
    const dataJson = {};
    dataJson.number_of_items = allTeamMembers.length;

    dataJson.items = [...allTeamMembers];

    return dataJson;
  } else {
    return {
      number_of_items: 0,
      items: [],
    };
  }
};
/**
 * get users in system not a member of current team
 * so they can be invited
 * @param {number} teamId unique id of team
 */
const getUsersNotInTeam = async function (teamId) {
  const getTeamsQuery = `SELECT DISTINCT tm.member_id, tm.first_name, tm.last_name, tm.email
  FROM team_member as tm
           INNER JOIN member_of AS mo ON mo.member_id = tm.member_id
  WHERE mo.team_id <> $1
    AND mo.member_id NOT IN
        (SELECT tm.member_id
         FROM team_member as tm
                  INNER JOIN member_of AS mo on mo.member_id = tm.member_id
         WHERE mo.team_id = $1);`;

  const allNonTeamMembers = await Helpers.runQuery(getTeamsQuery, [teamId]);

  if (allNonTeamMembers.length) {
    const dataJson = {};
    dataJson.number_of_items = allNonTeamMembers.length;

    dataJson.items = [...allNonTeamMembers];

    return dataJson;
  } else {
    return {
      number_of_items: 0,
      items: [],
    };
  }
};

/**
 * Check if user is admin of given team
 * @param {number} userId unique id of user
 * @param {number} teamId unique id of team
 */
const isUserTeamAdmin = async function (userId, teamId) {
  const adminQuery = `
    SELECT EXISTS(SELECT 1
        FROM team_member AS tm
                 INNER JOIN manages AS m ON m.member_id = tm.member_id
        WHERE m.member_id = $1
          AND m.team_id = $2);`;

  const filter = [userId, teamId];

  return Helpers.runQuery(adminQuery, filter);
};
/**
 *
 * @param {number} teamId unique id of team
 * @param {number} userId unique id of message author
 * @param {date} comment_date date message was posted
 * @param {string} comment_text message from user
 */
const addTeamComment = async function (
  teamId,
  userId,
  comment_date,
  comment_text
) {
  const teamComment = {
    member_id: userId,
    team_id: teamId,
    date: comment_date,
    message: comment_text,
  };

  return Comment.addComment("TEAM", teamComment);
};

/**
 * Get all comments on a team page
 * @param {number} teamId
 */
const getAllTeamComments = async function (teamId) {
  const teamObj = { team_id: teamId };

  const allComments = await Comment.getAllCommentsForEntity("TEAM", teamObj);

  if (allComments) {
    return {
      number_of_items: allComments.length || 0,
      items: [...allComments] || [],
    };
  } else {
    return {
      number_of_items: 0,
      items: [],
    };
  }
};

const getTeamTimes = async function () {
  const allTeamQuery = `SELECT team_id, team_name, evening_time, time_zone
  from team
  ORDER BY team_name ASC;`;

  return Helpers.runQuery(allTeamQuery, []);
};

/**** QUERIES FOR EMAILS ****/

/**
 * Get goals for specific user for the day
 * @param {string} email
 * @param {number} teamId
 */
const getGoalsForUser = async function (email, teamId) {
  const query = `select g.task_name, g.task_description, g.status from goal as g
inner join team_member as tm on tm.member_id = g.member_id
where DATE(g.date_time) = '2020-07-09' and tm.email = $1 and g.team_id = $2;`;

  const filter = [email, teamId];
  return Helpers.runQuery(query, filter);
};

/**
 * Get all comments on a team page
 * @param {number} teamId
 */
const getGoalsSummary = async function (teamId) {
  const query = `SELECT u1.first_name, u1.last_name, u1.email, u2.totalGoals, u2.finishedGoals
  FROM (SELECT tm.member_id, tm.first_name, tm.last_name, tm.email
  FROM team_member AS tm
  INNER JOIN member_of AS mo ON mo.member_id = tm.member_id
  WHERE mo.team_id = $1
  AND approved = true
  AND (date_left IS NULL OR date_left > '2020-07-09')) AS u1
  LEFT OUTER JOIN (SELECT member_id,
  count(*)                                       as totalGoals,
      sum(case when status = true then 1 else 0 end) as finishedGoals
  FROM goal
  WHERE team_id = $1
  AND DATE(date_time) = '2020-07-09'
  GROUP BY member_id) as u2
  ON u1.member_id = u2.member_id;`;

  const filter = [teamId];
  return Helpers.runQuery(query, filter);
};

/**
 * Get goals summary for current day for team email
 */
const teamEmailSummary = async function () {
  const goalSummary = {};

  const teams = await getTeamTimes();
  goalSummary.teams = [...teams];
  let goalMap = new Map(
    goalSummary.teams.map((items, idx) => [items.team_id, idx])
  );

  for (team of goalSummary.teams) {
    const memberStats = await getGoalsSummary(team.team_id);
    goalSummary.teams[goalMap.get(team.team_id)].members =
      [...memberStats] || [];
  }
  // console.log(goalSummary);
  for (team of goalSummary.teams) {
    for (member of team.members) {
      member.goals = await getGoalsForUser(member.email, team.team_id);
    }
  }

  return goalSummary;
};

module.exports = {
  getAllTeams,
  getTeamById,
  addTeam,
  updateTeam,
  deleteTeam,
  addUserToTeam,
  removeTeamMember,
  removePendingTeamMember,
  getAllUsersOnTeam,
  isUserTeamAdmin,
  addTeamComment,
  getAllTeamComments,
  approveUserRequest,
  updateTeamAdmin,
  getGoalsSummary,
  teamEmailSummary,
  getTeamTimes,
  getGoalsForUser,
  getUsersNotInTeam,
};
