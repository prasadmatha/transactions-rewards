const mysql = require("mysql");
require("dotenv").config();

const user = process.env.username;
const password = process.env.password;
const host = process.env.host;
const database = process.env.database;

async function connectionToMysql() {
  var connection = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
  });

  connection.connect(function (err) {
    if (err) {
      throw err.message;
    }
    console.log("Connected to Card91 database!");
  });

  return connection;
}

module.exports = connectionToMysql;
