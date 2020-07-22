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
    return 0;
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

const deleteTeam = async function (teamId) {
  //TODO implement
  console.log("NOT IMPLEMENTED YET!!");
};

const addUserToTeam = async function (teamId, userId, body) {
  const approved_ind = body.approved_ind ? true : false;

  const addTeamMemberQuery = `INSERT INTO member_of (member_id, team_id, approved, date_added)
    VALUES ($1, $2, $3, $4);`;

  const filter = [userId, teamId, approved_ind, body.date_added];

  const newTeamMember = await Helpers.updateData(addTeamMemberQuery, filter);

  console.log(newTeamMember);

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

const removeUserFromTeam = async function (userId, teamId) {
  //TODO implement
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
    return 0;
  }
};

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

module.exports = {
  getAllTeams,
  getTeamById,
  addTeam,
  updateTeam,
  deleteTeam,
  addUserToTeam,
  removeUserFromTeam,
  getAllUsersOnTeam,
  isUserTeamAdmin,
  addTeamComment,
  approveUserRequest,
  updateTeamAdmin,
};
