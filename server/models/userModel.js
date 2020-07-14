/* 
* userModel.js
* Functions to handle interactions between data model and returned data
*/
const Helpers = require('../handlers/helpers');
const crypto = require('crypto');



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

const addUser = async function(userInfoObject) {
    //TODO implement

    const newUserInsert = `INSERT INTO team_member (first_name, last_name, email, member_password)`;
    

}

const updateUser = async function(userInfoObject) {
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

module.exports={addUser,updateUser, getAllUsers, deleteUser, getAllTeamsForUser, getUserByEmail};