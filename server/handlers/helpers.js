// helpers.js
// This file is primarily responsible for generic database queries and interactions that can be reused regardless of entity
// https://node-postgres.com/features/queries

const {Pool, Client } = require('pg');



const dbConfig =  {"user": process.env.DATABASE_USER,
"host": process.env.DATABASE_HOST,
"database" : process.env.DATABASE_DB,
"password": process.env.DATABASE_PW,
"port": process.env.DATABASE_PORT}


const pool = new Pool(
   dbConfig
  );

// example from postgres client npm site
// pool.query('SELECT NOW()', (err, res) => {
//     console.log(err, res)
//     pool.end()
//   });
  

async function runQuery(queryText, queryValues) {
  // format query
  const query = {text: queryText, values: queryValues};
  
  // connect and run
  const queryResult = await pool.query(query);

  // get response
  if (queryResult.rowCount) {
    return queryResult.rows[0];
  }
   else {
     return 0;
   }
};

async function insertData(insertText, insertValues) {

  const query = {text: insertText, values: insertValues};

  const insertResult = await pool.query(query);

  console.log(insertResult.rows[0])
  console.log(insertResult.rows);



}

async function deleteData(deleteText) {

}


async function updateData(updateText) {

}

function addSelf(req, id, type, obj) {

  return `${req.protocol}://${req.get('host')}${type}/${id}`;
}


module.exports = {insertData, runQuery, deleteData, updateData, addSelf};