// helpers.js
// This file is primarily responsible for generic database queries and interactions that can be reused regardless of entity
// https://node-postgres.com/features/queries

const { Pool, Client } = require("pg");

const dbConfig = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_DB,
  password: process.env.DATABASE_PW,
  port: process.env.DATABASE_PORT,
};

if (
  !dbConfig.host ||
  !dbConfig.database ||
  !dbConfig.password ||
  !dbConfig.port
) {
  console.log("WARNING!!! AT LEAST ONE DATABASE CONFIGURATION IS NOT SET!!");
}

// should probably not do this if above returns true anywhere ...
//TODO: also maybe shut down if DB can't connect, because, what's the point?
const pool = new Pool(dbConfig);

/**
 * Runs query based on parameter array provided. DB Driver requires second
 * argument to be array. Returns first set in rows array or 0 if no results
 * @param {string} queryText text of query with substitute parameters
 * @param {array} queryValues array of parameters for query
 */
async function runQuery(queryText, queryValues) {
  // format query
  const query = { text: queryText, values: queryValues };
  // connect and run
  const queryResult = await pool.query(query);

  // get response
  if (queryResult.rowCount) {
    return queryResult.rows;
  } else {
    return 0;
  }
}

/**
 * Inserts data into database and returns unique key for new entity
 * @param {string} insertText query text of insert statement
 * @param {array} insertValues user input
 * @param {string} key_name field that should be returned after insert statement
 */
async function insertData(insertText, insertValues, key_field_name) {
  const query = { text: insertText, values: insertValues };

  const insertResult = await pool.query(query);

  // uncomment to check out what is returned
  //console.log(insertResult.rows[0][key_name])
  //console.log(insertResult.rows);

  // return id so it can be added to entity and formatted after insert
  return insertResult.rows[0][key_field_name];
}

async function deleteData(deleteText, filterValues) {
  const query = { text: deleteText, values: filterValues };

  const deleteResult = await pool.query(query);

  console.log(deleteResult);

  return deleteResult;
}

async function updateData(updateText, updateValues) {
  // format query
  const query = { text: updateText, values: updateValues };
  // connect and run
  const queryResult = await pool.query(query);

  if (updateText.indexOf("RETURNING") === -1) {
    return queryResult.rowCount;
  } else {
    // get response
    if (queryResult.rowCount) {
      return queryResult.rows[0];
    } else {
      return 0;
    }
  }
}

/**
 * Adds resource location to object based on environment and entity
 * @param {request} req inbound request from route used to get where app is hosted
 * @param {number} id unique id of entity
 * @param {string} type base URL of entity ex: users
 */
function addSelf(req, id, type) {
  if (Array.isArray(id)) {
    let unique_id;
    switch (type) {
      case "users":
        unique_id = "member_id";
        break;
      case "teams":
        unique_id = "team_id";
        break;
    }
    id.forEach((obj) => {
      obj.self = `${req.protocol}://${req.get("host")}/${type}/${
        obj[unique_id]
      }`;
    });
    return id;
  } else {
    return `${req.protocol}://${req.get("host")}/${type}/${id}`;
  }
}

module.exports = { insertData, runQuery, deleteData, updateData, addSelf };
