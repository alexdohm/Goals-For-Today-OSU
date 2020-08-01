/*
 * teamStatisticsModel.js
 * Functions to handle interactions between data model and returned data
 */
const Helpers = require("../handlers/helpers");

/**
 * Returns statistics per team member for goals completed on a certain date
 * @param {number} teamId unique team id
 * @param {date} asOfDate date that goal was created on
 */
const goalsCompletedPerTeamMemberDate = async function (teamId, asOfDate) {
  const finishedGoalsQuery = `SELECT u1.member_id, u1.first_name, u1.last_name, u2.totalGoals, u2.finishedGoals
  FROM (SELECT tm.member_id, tm.first_name, tm.last_name, tm.user_name
        FROM team_member AS tm
                 INNER JOIN member_of AS mo ON mo.member_id = tm.member_id
        WHERE mo.team_id = $1
          AND approved = true
          AND (date_left IS NULL OR date_left > $2)) AS u1
           LEFT OUTER JOIN (SELECT member_id,
                                   count(*)                                       as totalGoals,
                                   sum(case when status = true then 1 else 0 end) as finishedGoals
                            FROM goal
                            WHERE team_id = $1
                              AND DATE(date_time) = $2
                            GROUP BY member_id) as u2
                           ON u1.member_id = u2.member_id;`;

  const finishedGoals = await Helpers.runQuery(finishedGoalsQuery, [
    teamId,
    asOfDate,
  ]);

  finishedGoals.forEach((goal) => {
    goal.finishedgoals = parseInt(goal.finishedgoals);
    goal.totalgoals = parseInt(goal.totalgoals);
  });

  return finishedGoals;
};
/**
 * Returns statistics per team member for goals completed in a date range
 * @param {number} teamId unique team id
 * @param {date} beginDate date to begin looking for completed goals
 * @param {date} endDate date to end looking for completed goals
 */
const goalsCompletedPerTeamMemberPeriod = async function (
  teamId,
  beginDate,
  endDate
) {
  const timePeriodGoalsQuery = `SELECT u1.member_id, u1.first_name, u1.last_name, u1.date_left, u2.goalDate, u2.totalGoals, u2.finishedGoals
  FROM (SELECT tm.member_id, tm.first_name, tm.last_name, tm.user_name, mo.date_left
        FROM team_member AS tm
                 INNER JOIN member_of AS mo ON mo.member_id = tm.member_id
        WHERE mo.team_id = $1
          AND approved = true
          AND (date_left IS NULL OR date_left >= $2)) AS u1
           LEFT OUTER JOIN (SELECT member_id,
                                   DATE(date_time)                                as goalDate,
                                   count(*)                                       as totalGoals,
                                   sum(case when status = true then 1 else 0 end) as finishedGoals
                            FROM goal
                            WHERE team_id = $1
                              AND DATE(date_time) >= $2
                              AND DATE(date_time) < $3
                            GROUP BY member_id, DATE(date_time)) as u2
                           ON u1.member_id = u2.member_id;`;
  const finishedGoals = await Helpers.runQuery(timePeriodGoalsQuery, [
    teamId,
    beginDate,
    endDate,
  ]);

  //console.log(finishedGoals);

  finishedGoals.forEach((goal) => {
    goal.finishedgoals = parseInt(goal.finishedgoals);
    goal.totalgoals = parseInt(goal.totalgoals);
  });

  return finishedGoals;
};
/**
 * Returns amount of goals completed aggregated for team broken out by date of goal
 * Not split per team member
 * @param {number} teamId unique team id
 * @param {date} beginDate date to begin looking for completed goals
 * @param {date} endDate date to end looking for completed goals
 */
const goalsCompletedInPeriod = async function (teamId, beginDate, endDate) {
  const allForTeamQuery = `SELECT DATE(date_time) as goalDate,
  count(*)                                       as totalGoals,
  sum(case when status = true then 1 else 0 end) as finishedGoals
FROM goal
WHERE team_id = $1
AND DATE(date_time) >= $2
AND DATE(date_time) < $3
GROUP BY member_id, DATE(date_time);`;

  const finishedGoals = await Helpers.runQuery(allForTeamQuery, [
    teamId,
    beginDate,
    endDate,
  ]);
  console.log(finishedGoals);

  finishedGoals.forEach((goal) => {
    goal.finishedgoals = parseInt(goal.finishedgoals);
    goal.totalgoals = parseInt(goal.totalgoals);
  });

  return finishedGoals;
};
/**
 * Aggregates statistics and returns JSON with 3 arrays
 * @param {number} teamId unique team id
 * @param {date} beginDate date to begin looking for completed goals
 * @param {date} endDate date to end looking for completed goals
 */
const getAllTeamStats = async function (teamId, beginDate, endDate) {
  // gather each statistics for the team
  const teamCompletedInPeriod = await goalsCompletedInPeriod(
    teamId,
    beginDate,
    endDate
  );

  const completedPerMemberDate = await goalsCompletedPerTeamMemberDate(
    teamId,
    endDate
  );

  const completedPerMemberInPeriod = await goalsCompletedPerTeamMemberPeriod(
    teamId,
    beginDate,
    endDate
  );

  // put it all together
  const teamStatsJson = {};
  teamStatsJson.teamCompletedInPeriod = teamCompletedInPeriod || [];
  teamStatsJson.completedPerMemberDate = completedPerMemberDate || [];
  teamStatsJson.completedPerMemberInPeriod = completedPerMemberInPeriod || [];

  // send
  return teamStatsJson;
};

module.exports = {
  getAllTeamStats,
};
