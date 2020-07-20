/*
 * userModel.js
 * Functions to handle interactions between data model and returned data
 */
const Helpers = require("../handlers/helpers");
const crypto = require("crypto");
const Mail = require("../handlers/email");

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
  const queryString = `SELECT member_id, email FROM team_member WHERE member_password = crypt($1, member_password) AND email = $2`;
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
    avatar: userInfoObject.avatar || existingUser.avatar
    //password -- should probably keep this separate ✔
  };

  const filter = [`${updatedUser.first_name}`, `${updatedUser.last_name}`, `${updatedUser.email}`, `${updatedUser.time_zone}` ,
  `${updatedUser.verified}`, `${updatedUser.user_name}`, `${updatedUser.active}`, `${updatedUser.morning_time}`,
  `${updatedUser.evening_time}`, `${updatedUser.avatar}`, userId ];

  const updateQuery =
  `UPDATE team_member 
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

  //console.log(updateQuery);

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

const updateUserAvatar = async function (userInfoObject) {
  //TODO implement
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

const getAllUsers = async function () {
  //TODO implement
};

/**
 * deletes a user and inactivates team memberships
 * @param {number} userId unique id of user
 * @param {number} teamId 
 * @param {date} date current date
 */
const deleteUser = async function (userId, teamId, date) {
  //TODO what happens if a user is a member of more than 1 team?
  
  // user deletes personal account [ member_id, team_id, date ]
  const deleteQuery = 
  `SELECT n1.team_name
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
                                            WHERE member_id = 3) AS q2
                                           ON (q2.team_name = q1.team_name)) AS n2
                      ON n1.team_name = n2.team_name;
  UPDATE team_member
  SET active = false
  WHERE member_id = 1;
  UPDATE member_of
  SET date_left = '2020-07-09'
  WHERE member_id = 1
    AND team_id = 1;
  `
};

const getAllTeamsForUser = async function (userId) {
  
  const teamQuery = 
  `SELECT t.team_id, t.team_name
   FROM team as t
           INNER JOIN member_of AS mo ON mo.team_id = t.team_id
           INNER JOIN team_member as tm on tm.member_id = mo.member_id
  WHERE tm.member_id = $1
    AND mo.approved = TRUE
    AND mo.date_left IS NULL;`;

    const filter = [userId];

    const teams = await Helpers.runQuery(teamQuery, filter);

    console.log(teams);

    const jsonResponse = {number_of_items: teams.length};

    jsonResponse.items = [...teams];

    return jsonResponse;
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
  updateUserAvatar,
  getUserById,
  updateUser
};
