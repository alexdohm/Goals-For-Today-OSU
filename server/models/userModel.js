/* 
* userModel.js
* Functions to handle interactions between data model and returned data
*/
const Helpers = require('../handlers/helpers');
const crypto = require('crypto');

const addUser = async function(firstName, lastName, email, password) {
    //TODO implement
    const queryString = `INSERT INTO team_member (first_name, last_name, email, member_password) VALUES ($1, $2, $3, crypt($4, gen_salt('bf')))`;
    const filter = [firstName, lastName, email, password]
    const user = await  Helpers.runQuery(queryString, filter);
    if (user) {
        return user;
    }
    else {
        return '404';
    }
}

// check if user password and email match a record in database
// returns T or F
const getUserEmailAndPass = async function(userEmail, userPass) {
    //TODO
    const queryString = `SELECT (password = crypt($1, password)) AS pwd_match from team_member where username = $2`
    const filter = [userEmail, userPass];
    const user = await  Helpers.runQuery(queryString, filter);

    if (user) {
        return user;
    }
    else {
        return '404';
    }
}

//admin approves user to be a member of a team
const updateUserApprovedStatus = async function(userId, teamId) {
    //TODO
    const queryString = `UPDATE member_of SET approved = true WHERE member_id = $1 AND team_id = $2`
    const filter = [userId, teamId];
    const user = await  Helpers.runQuery(queryString, filter);

    if (user) {
        return user;
    }
    else {
        return '404';
    }
}

const getUserByEmail = async function(userEmail) {
    const user = await  Helpers.runQuery("SELECT * FROM team_member WHERE email = $1", [userEmail]);
    if (user) {
        delete user.member_password;
        return user;
    }
    else {
        return '404';
    }
}


const updateUserUsername = async function(userId, userName) {
    //TODO implement
    //there should be a delay in the front here here so we aren't constantly trying to update
    // if a user is typing in their new user name
    const queryString = `UPDATE team_member SET user_name = $1 WHERE member_id = $2`
    const filter = [userName, userId];
    const user = await  Helpers.runQuery(queryString, filter);
    if (user) {
        return user;
    }
    else {
        return '404';
    }
}

const updateUserTimeZone= async function(userId, timeZone) {
    //TODO implement
    //might have null objects here
    const queryString = `UPDATE team_member SET time_zone = $1 WHERE member_id = $2`
    const filter = [timeZone, userId];
    const user = await Helpers.runQuery(queryString, filter);
    if (user) {
        return user;
    }
    else {
        return '404';
    }
}

const updateUserAvatar = async function(userInfoObject) {
    //TODO implement
}

const getAllUsers = async function() {
    //TODO implement
}

const deleteUser = async function(userId) {
    //TODO implement
}

const getAllTeamsForUser = async function(userId) {
    //TODO implement
}

module.exports={addUser, getAllUsers, deleteUser,
    getAllTeamsForUser, getUserByEmail, updateUserApprovedStatus,
    getUserEmailAndPass, updateUserUsername, updateUserTimeZone, updateUserAvatar};