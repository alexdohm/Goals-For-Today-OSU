/*
 * userModel.js
 * Functions to handle interactions between data model and returned data
 */
const Helpers = require("../handlers/helpers");
const crypto = require("crypto");
const Mail = require("../handlers/email");
const Team = require("./teamModel");
const Goal = require("./goalModel");
const Comment = require("./commentModel");

const addUser = async function (firstName, lastName, email, password, req) {
  const queryString = `INSERT INTO team_member (first_name, last_name, email, member_password) VALUES ($1, $2, $3, crypt($4, gen_salt('bf'))) returning member_id`;
  const filter = [firstName, lastName, email, password];
  const user = await Helpers.insertData(queryString, filter, "member_id");

  if (user) {
    // NOTE: this should probably go into the auth controller section but putting it
    // here for testing/initial dev because I don't have all the auth stuff setup yet

    // create token
    const userVerificationToken = crypto.randomBytes(20).toString("hex");

    // TODO store token in DB for user so we can lookup later

    // generate verify link
    const userLink = `${req.protocol}://users/verify/${userVerificationToken}`;

    // send verification email
    const mailOptions = {
      email: email,
      subject: "Welcome to Goals For Today!",
      filename: "welcome",
      name: `${firstName} ${lastName}`,
      new_user_link: userLink,
    };

    // don't really need this but temporarily putting to see how it works
    // const mailoutcome = await Mail.send(mailOptions);

    //console.log(mailoutcome);
  }
  // I think error handling upstream should be enough if we get something weird back
  return getUserById(user);
};

// check if user password and email match a record in database
// returns row of user
const getUser = async function (userEmail, userPass) {
  const queryString = `SELECT member_id, email FROM team_member WHERE member_password = crypt($1, member_password) AND email = $2 and active=true`;
  const filter = [userPass, userEmail];

  const user = await Helpers.runQuery(queryString, filter);
  if (user) {
    return user;
  } else {
    return "404";
  }
};

/* For update user we can have 1 function that will change only the provided settings */

/**
 * Updates user attributes provided by inbound object
 * @param {number} userId
 * @param {object} userInfoObject body of inbound request with which fields should be changed
 *                 not guaranteed to have all fields (PATCH) so retrieve existing user settings
 *                 first
 */

const updateUser = async function (userId, userInfoObject) {
  // first, get the user make sure it exists
  const existingUser = await getUserById(userId);

  if (existingUser === "404") {
    // short circuit and return user not found
    return existingUser;
  }

  // TODO: there are only a couple fields that a user can change, most of this isn't needed
  // second, set up fields that may have changed or keep them the same
  const updatedUser = {
    first_name: userInfoObject.first_name || existingUser.first_name,
    last_name: userInfoObject.last_name || existingUser.last_name,
    email: userInfoObject.email || existingUser.email,
    time_zone: userInfoObject.time_zone || existingUser.time_zone,
    verified: userInfoObject.verified || existingUser.verified,
    user_name: userInfoObject.user_name || existingUser.user_name,
    active: userInfoObject.active || existingUser.active,
    morning_time: userInfoObject.morning_time || existingUser.morning_time,
    evening_time: userInfoObject.evening_time || existingUser.evening_time,
    avatar: userInfoObject.avatar || existingUser.avatar,
    //password -- should probably keep this separate ✔
  };

  const filter = [
    `${updatedUser.first_name}`,
    `${updatedUser.last_name}`,
    `${updatedUser.email}`,
    `${updatedUser.time_zone}`,
    `${updatedUser.verified}`,
    `${updatedUser.user_name}`,
    `${updatedUser.active}`,
    `${updatedUser.morning_time}`,
    `${updatedUser.evening_time}`,
    `${updatedUser.avatar}`,
    userId,
  ];

  const updateQuery = `UPDATE team_member 
   SET first_name = $1, 
      last_name = $2, 
      email = $3, 
      time_zone = $4, 
      verified = $5, 
      user_name = $6, 
      active = $7, 
      morning_time = $8, 
      evening_time = $9, 
      avatar = $10 
   WHERE member_id = $11
   
   RETURNING * `;

  return Helpers.updateData(updateQuery, filter);
};

//admin approves user to be a member of a team
const updateUserApprovedStatus = async function (userId, teamId) {
  //TODO
  const queryString = `UPDATE team_member () SET VALUE`;
  const filter = [userId, teamId];
  const user = await Helpers.runQuery(queryString, filter);

  if (user) {
    return user;
  } else {
    return "404";
  }
};

const updateUserUsername = async function (userId, userName) {
  //TODO implement
  //there should be a delay in the front here here so we aren't constantly trying to update
  // if a user is typing in their new user name
  const queryString = `UPDATE team_member SET user_name = $1 WHERE member_id = $2`;
  const filter = [userName, userId];
  const user = await Helpers.runQuery(queryString, filter);
  if (user) {
    return user;
  } else {
    return "404";
  }
};

const updateUserTimeZone = async function (userId, timeZone) {
  //TODO implement
  //might have null objects here
  const queryString = `UPDATE team_member SET time_zone = $1 WHERE member_id = $2`;
  const filter = [timeZone, userId];
  const user = await Helpers.runQuery(queryString, filter);
  if (user) {
    return user;
  } else {
    return "404";
  }
};

/**
 * Returns user object based provided on email address
 * @param {string} userEmail
 */
const getUserByEmail = async function (userEmail) {
  const user = await Helpers.runQuery(
    "SELECT * FROM team_member WHERE email = $1",
    [userEmail]
  );
  if (user) {
    delete user[0].member_password;
    return user[0];
  } else {
    return "404";
  }
};

/**
 * Return pending requests
 * @param {string} user_id
 */
const getUserPendingRequests = async function (user_id) {
  const requests = await Helpers.runQuery(
    `SELECT t.team_id, t.team_name
FROM team as t
         INNER JOIN member_of AS mo ON mo.team_id = t.team_id
WHERE mo.approved = false
  AND mo.member_id = $1;`,
    [user_id]
  );

  if (requests) {
    return requests;
  } else {
    return [];
  }
};

/**
 * Returns user object based on member_id
 * @param {number} id
 */
const getUserById = async function (id) {
  const user = await Helpers.runQuery(
    "SELECT * FROM team_member WHERE member_id = $1",
    [id]
  );
  if (user) {
    delete user[0].member_password;
    return user[0];
  } else {
    return "404";
  }
};
/**
 * get all users -- mostly useful for troubleshooting
 */
const getAllUsers = async function () {
  const allUserQuery = `
  select
  tm.member_id,
  tm.first_name,
  tm.last_name,
  tm.user_name,
  tm.email,
  tm.verified,
  tm.active,
  CASE
  WHEN mo.member_id is null THEN false
  ELSE true
  END AS HAS_TEAMS,
  tm.avatar
  from
  team_member tm
  LEFT JOIN member_of mo ON tm.member_id = mo.member_id;`;

  const allUsers = await Helpers.runQuery(allUserQuery, []);

  if (allUsers) {
    return {
      number_of_items: allUsers.length || 0,
      items: [...allUsers] || [],
    };
  } else {
    return {
      number_of_items: 0,
      items: [],
    };
  }
};

/**
 * Get all all user level comments
 * @param {number} userId unique id of user
 * @param {number} teamId unique id of team
 */
const getUserComments = async function (userId, teamId) {
  const userObj = { user_id: userId, team_id: teamId };

  const allComments = await Comment.getAllCommentsForEntity("USER", userObj);

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

/**
 *
 * @param {number} teamId unique id of team
 * @param {number} userId unique id of user whos being commented on
 * @param {number} author unique id of author of comment
 * @param {string} comment_text comment text
 * @param {date} comment_date date comment was written
 */
const addUserComment = async function (
  teamId,
  userId,
  author,
  comment_text,
  comment_date
) {
  const userComment = {
    member_id: author,
    id_user_page: userId,
    team_id: teamId,
    date: comment_date,
    message: comment_text,
  };

  return Comment.addComment("USER", userComment);
};

/**
 * Returns all necessary information when user clicks to load dashboard
 * for a team after they have already logged in
 * @param {number} userId
 * @param {number} teamId
 */
const getUserTeamGoalsComments = async function (userId, teamId) {
  const teamInfo = {};

  const teamDetails = await Team.getTeamById(teamId);

  // get fellow team members
  const teamMembers = await Team.getAllUsersOnTeam(teamId);

  // determine if user is admin of the team
  const adminStatus = await Team.isUserTeamAdmin(userId, teamId);

  // build team json
  teamInfo.team_id = teamId;
  teamInfo.team_name = teamDetails.team_name;
  teamInfo.team_members = [...teamMembers.items];
  teamInfo.team_admin = adminStatus[0].exists;

  let teamMap = new Map(
    teamInfo.team_members.map((member, idx) => [member.member_id, idx])
  );

  // get goals and comments for every team member
  for (member of teamInfo.team_members) {
    const memberGoals = await Goal.getAllGoalsForUser(member.member_id, teamId);
    const memberComments = await getUserComments(member.member_id, teamId);

    if (memberGoals.number_of_items) {
      teamInfo.team_members[teamMap.get(member.member_id)].goals = [
        ...memberGoals.items,
      ];
    } else {
      teamInfo.team_members[teamMap.get(member.member_id)].goals = [];
    }

    if (memberComments.number_of_items) {
      teamInfo.team_members[teamMap.get(member.member_id)].user_comments = [
        ...memberComments.items,
      ];
    } else {
      teamInfo.team_members[teamMap.get(member.member_id)].user_comments = [];
    }
  }
  // get index of current user
  const curUser = teamMap.get(userId);
  teamInfo.team_members.splice(curUser, 1);

  // get goals for this user and this team
  const userGoals = await Goal.getAllGoalsForUser(userId, teamId);

  teamInfo.goals = [...userGoals.items];

  // if they are on a team, see if there are user comments from team members
  const userComment = await getUserComments(userId, teamId);

  teamInfo.user_comments = [...userComment.items];

  return teamInfo;
};

/**
 * Function to load user data based on first team
 * returned (if they have team) for initial login
 * @param {string} userEmail
 * @param {string} teamId
 */
const loadUserInfoOnLogin = async function (userEmail, teamId) {
  const userDataJson = {};

  const userInfo = await getUserByEmail(userEmail);
  if (!userInfo.active || !userInfo) {
    return "404";
  }
  let userTeams = {};
  if (teamId === "-1") {
    userTeams = await getAllTeamsForUser(userInfo.member_id);
  } else {
    userTeams = await getTeamForUser(userInfo.member_id, teamId);
  }

  // const userTeams = await getAllTeamsForUser(userInfo.member_id);
  // const userTeams = await getTeamForUser(userInfo.member_id, teamId);

  // set basic user data
  userDataJson.member_id = userInfo.member_id;
  userDataJson.first_name = userInfo.first_name;
  userDataJson.last_name = userInfo.last_name;
  userDataJson.email = userInfo.email;
  userDataJson.morning_time = userInfo.morning_time;
  userDataJson.evening_time = userInfo.evening_time;
  userDataJson.time_zone = userInfo.time_zone;
  userDataJson.time_zone = userInfo.time_zone;
  userDataJson.verified = userInfo.verified;
  userDataJson.active = userInfo.active;
  userDataJson.avatar = userInfo.avatar;
  userDataJson.evening_time = userInfo.evening_time;

  if (!userTeams.number_of_items) {
    // user has no teams
    userDataJson.team = {};
    userDataJson.goals = [];
    userDataJson.comments = [];
    return userDataJson;
  } else {
    // get team info for the first team in the list
    userDataJson.team = await getUserTeamGoalsComments(
      userInfo.member_id,
      userTeams.items[0].team_id
    );
    return userDataJson;
  }
};

const deleteTeamsOfDeletedMember = async function (memberId) {
  const deleteQuery = `DELETE FROM team t 
WHERE t.team_id IN (SELECT t.team_id
	FROM team t 
		INNER JOIN member_of mo ON t.team_id = mo.team_id
	WHERE mo.member_id = $1
	AND EXISTS (SELECT 1 FROM manages m WHERE m.team_id = t.team_id AND m.member_id = $1)
	GROUP BY t.team_id
  HAVING count(*) = 1)
  RETURNING t.team_name`;

  return Helpers.deleteData(deleteQuery, [memberId]);
};

const updateUserMorningTime = async function (userId, morning_time) {
  const queryString = `UPDATE team_member SET morning_time = $1 WHERE member_id = $2`;
  const filter = [morning_time, userId];
  return Helpers.runQuery(queryString, filter);
};

/**
 * deletes a user and inactivates team memberships
 * @param {number} userId unique id of user
 * @param {number} teamId
 * @param {date} date current date
 */
const deleteUser = async function (userId, date) {
  // check if user is sole admin of any teams
  // if yes, they must assign another member admin status and cannot delete their account
  const checkAdminQuery = `SELECT n1.team_name
  FROM (SELECT t.team_name, count(*) AS totalRows
        FROM team AS t
                 INNER JOIN member_of AS mo ON mo.team_id = t.team_id
        WHERE mo.approved = true
        GROUP BY t.team_name
        HAVING count(*) > 1) AS n1
           INNER JOIN (SELECT q1.team_name
                       FROM (SELECT t.team_name, count(*) AS totalRows
                             FROM team AS t
                                      INNER JOIN manages m ON m.team_id = t.team_id
                             GROUP BY t.team_name
                             HAVING count(*) = 1) AS q1
                                INNER JOIN (SELECT t.team_name
                                            FROM team AS t
                                                     INNER JOIN manages m ON m.team_id = t.team_id
                                            WHERE member_id = $1) AS q2
                                           ON (q2.team_name = q1.team_name)) AS n2
                      ON n1.team_name = n2.team_name;`;

  const adminResult = await Helpers.runQuery(checkAdminQuery, [userId]);
  if (adminResult) {
    const requestForbidden = {
      message:
        "You must first assign admin privileges to at least one team member for the following teams:",
      teams: adminResult,
      name: "SOLE_ADMIN",
      status: 403,
    };
    throw requestForbidden;
  }

  // if we get here, we can inactivate the user
  // if they are the sole member (and admin) of any teams, delete those teams
  const deletedTeams = await deleteTeamsOfDeletedMember(userId);

  // if there are teams with multiple members this user was a part of,
  // update the date the user left the team
  const updateMemberOf = `UPDATE member_of
  SET date_left = $1
  WHERE member_id = $2
  AND date_left IS NULL`;
  const memberOfUpdate = await Helpers.updateData(updateMemberOf, [
    date,
    userId,
  ]);

  // finally, inactivate the user
  const inactivate = `UPDATE team_member
  SET active = false
  WHERE member_id = $1;`;

  const teamMemberUpdate = await Helpers.updateData(inactivate, [userId]);

  if (teamMemberUpdate) {
    return true;
  } else {
    return false;
  }
};

/**
 * Returns formatted json object with array of teams that a user is a member of
 * @param {number} userId
 */
const getAllTeamsForUser = async function (userId) {
  const teamQuery = `SELECT t.team_id, t.team_name
   FROM team as t
           INNER JOIN member_of AS mo ON mo.team_id = t.team_id
           INNER JOIN team_member as tm on tm.member_id = mo.member_id
  WHERE tm.member_id = $1
    AND mo.approved = TRUE
    AND mo.date_left IS NULL;`;

  const filter = [userId];

  const teams = await Helpers.runQuery(teamQuery, filter);

  if (!teams) {
    return teams;
  }

  const jsonResponse = { number_of_items: teams.length };

  jsonResponse.items = [...teams];

  return jsonResponse;
};

/**
 * Returns formatted json object with specific team that a user is a member of
 * @param {number} userId
 * @param {number} teamId
 */
const getTeamForUser = async function (userId, teamId) {
  const teamQuery = `SELECT t.team_id, t.team_name
   FROM team as t
           INNER JOIN member_of AS mo ON mo.team_id = t.team_id
           INNER JOIN team_member as tm on tm.member_id = mo.member_id
  WHERE tm.member_id = $1
    AND t.team_id = $2
    AND mo.approved = TRUE
    AND mo.date_left IS NULL;`;

  const filter = [userId, teamId];

  const teams = await Helpers.runQuery(teamQuery, filter);

  if (!teams) {
    return teams;
  }

  const jsonResponse = { number_of_items: teams.length };

  jsonResponse.items = [...teams];

  return jsonResponse;
};

/**
 * Get teams that user is not a part of
 * so they can request to join them
 * @param {number} userId unique member id
 */
const getNonTeamsForUser = async function (userId) {
  const nonMemberQuery = `SELECT DISTINCT t.team_name, t.team_id
  FROM team as t
           INNER JOIN member_of AS mo ON mo.team_id = t.team_id
  WHERE mo.member_id <> $1
    AND mo.team_id NOT IN
        (SELECT t.team_id
         FROM team as t
                  INNER JOIN member_of AS mo on mo.team_id = t.team_id
         WHERE mo.member_id = $1);`;

  const notJoinedTeams = await Helpers.runQuery(nonMemberQuery, [userId]);

  if (notJoinedTeams.length) {
    const dataJson = {};
    dataJson.number_of_items = notJoinedTeams.length;

    dataJson.items = [...notJoinedTeams];

    return dataJson;
  } else {
    return {
      number_of_items: 0,
      items: [],
    };
  }
};

/**
 * Returns all active users in system for user email reminders
 */
const getAllEmailTimesForUsers = async function () {
  const queryString = `SELECT first_name, last_name, email, morning_time, evening_time, time_zone
FROM team_member
WHERE active = true
AND email IN (SELECT DISTINCT tm.email
FROM team_member as tm
INNER JOIN member_of AS mo ON mo.member_id = tm.member_id);`;
  const filter = [];
  const user = await Helpers.runQuery(queryString, filter);
  if (user) {
    return user;
  } else {
    return "404";
  }
};

module.exports = {
  addUser,
  getAllUsers,
  deleteUser,
  getAllTeamsForUser,
  getUserByEmail,
  updateUserApprovedStatus,
  getUser,
  updateUserUsername,
  updateUserTimeZone,
  updateUserMorningTime,
  getUserById,
  updateUser,
  getAllEmailTimesForUsers,
  loadUserInfoOnLogin,
  getUserTeamGoalsComments,
  getUserComments,
  addUserComment,
  getNonTeamsForUser,
  getTeamForUser,
  getUserPendingRequests,
};
