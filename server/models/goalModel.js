/* 
* goalModel.js
* Functions to handle interactions between data model and returned data
*/
const Helpers = require('../handlers/helpers');
const Comment = require('./commentModel');

const addGoal = async function(goalInfoOjbect) {
    //TODO implement
}


/**
 * Get all goals and comments on those goals for a user
 * @param {date} date 
 * @param {number} memberId 
 * @param {number} teamId 
 */
const getAllGoalsForUser = async function (date, memberId, teamId) {

    //    --list of goals for user [ need member_id, team_id and date]
    const goalQuery =
        `SELECT goal_id, task_name, task_description
        FROM goal
        WHERE DATE(date_time) = $1
        AND member_id = $2
        AND team_id = $3;`;

    const filters = [date, memberId, teamId];

    const goalList = await Helpers.runQuery(goalQuery, filters);

    // see how many we got back, get comments if any
    if (goalList.length) {

        for (goal of goalList) {
            goal.comments = [];
            const c = await Comment.getAllCommentsForEntity("GOAL", { "goal_id": goal.goal_id })

            if (c.length) {
                goal.comments = [...c];
                //console.log(goal.comments)
            }
        }
    }
    return goalList;
}

const updateGoal = async function(goalInfoOjbect) {
    //TODO implement
}

const deleteGoal = async function(goalId) {
    //TODO implement
}

module.exports = {addGoal, getAllGoalsForUser, updateGoal, deleteGoal};