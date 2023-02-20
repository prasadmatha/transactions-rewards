const mysql = require("mysql");
require("dotenv").config();

const user = process.env.username;
const password = process.env.password;
const host = process.env.host;
const database = process.env.database;

function connectionToMysql() {
  return new Promise((resolve, reject) => {
    var connection = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database,
    });

    connection.connect(function (err) {
      if (err) {
        return reject(err);
      }
      console.log("Connected to card91 database!");
      return resolve(connection);
    });
  });
}

module.exports = connectionToMysql;
