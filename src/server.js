const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dbConnection = require("../dbConnection");
const regex = require("../regex");
const utility = require("../utility");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const secret_key = process.env.secret_key;
let db;

const initializeDbAndServer = async function () {
  db = await dbConnection();
  app.listen(PORT, () => {
    console.log(`Server is running on PORT :: ${PORT}`);
  });
};

//initializing database and server
initializeDbAndServer();

app.get("/", (req, res) => {
  let dbQuery = `select * from user`;
  db.query(dbQuery, (err, data) => {
    if (err) {
      throw er;
    }
    res.status(200).send(data[0]);
  });
});
