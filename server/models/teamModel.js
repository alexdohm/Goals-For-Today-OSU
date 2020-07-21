/*
 * teamModel.js
 * Functions to handle interactions between data model and returned data
 */
const Helpers = require("../handlers/helpers");

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
 */
const addTeam = async function (name, date) {
  const newTeamQuery = `INSERT INTO team (team_name, date_created)
  VALUES ($1, $2)
  returning team_id;`;

  const filter = [name, date];

  const newTeamId = await Helpers.insertData(newTeamQuery, filter, "team_id");

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

const adduserToTeam = async function (userId, teamId) {
  //TODO implement
};

const removeUserFromTeam = async function (userId, teamId) {
  //TODO implement
};

const getAllUsersOnTeam = async function (teamId) {
  //TODO implement

  const teamMembersQuery = `SELECT tm.member_id, tm.first_name, tm.last_name, tm.user_name
    FROM team_member AS tm
             INNER JOIN member_of AS mo ON mo.member_id = tm.member_id
             INNER JOIN team AS t ON t.team_id = mo.team_id
    WHERE t.team_id = $1;`;

  const filter = [teamId];

  const allTeamMembers = await Helpers.runQuery(teamMembersQuery, filter);

  console.log(allTeamMembers);

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

module.exports = {
  getAllTeams,
  getTeamById,
  addTeam,
  updateTeam,
  deleteTeam,
  adduserToTeam,
  removeUserFromTeam,
  getAllUsersOnTeam,
  isUserTeamAdmin,
};
