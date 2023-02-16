const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dbConnection = require("../dbConnection");
const dbQuery = require("../dbQuery");
const datahash = require("../datahash");
const regex = require("../regex");
const utility = require("../utility");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const secret_key = process.env.secret_key;
let db;

//iniinitializeDbAndServer
const initializeDbAndServer = async function () {
  db = await dbConnection();
  app.listen(PORT, () => {
    console.log(`Server is running on PORT :: ${PORT}`);
  });
};

//invoking initializeDbAndServer
initializeDbAndServer();

//home page url
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Card91");
});

//creating customer
app.post("/create/customer", async (req, res) => {
  let body = req.body; //request body
  let mandatoryFieldsErrors = utility.mandatoryFields(body, "user"); //check mandatory fields

  if (!mandatoryFieldsErrors.length) {
    //if no mandatory fields errors
    let user = await dbQuery.getEntityDetails(db, body, "user"); //get existed user with email or mobile

    if (!user.length) {
      //if no user exists
      body.password = await datahash.encryptData(body.password, 10); //encrypt password
      body.email = body.email.toLowerCase();
      let lastRowOfEntity = await dbQuery.getLastRowOfEntity(db, "user");
      let id = lastRowOfEntity.length ? lastRowOfEntity[0].id + 1 : 0;
      body.id = id;
      let dbResponse = await dbQuery.createRowinEntity(db, body, "user");
      res.status(200).send({
        isSuccessful: true,
        message: `User is created successfully with the id :: ${id}`,
      });
    } else {
      res.status(400).send({
        isSuccessful: false,
        message: "mobile or email already exists",
      });
    }
  } else {
    //if mandatory fields errors
    res.status(400).send({
      isSuccessful: false,
      message: `Please provide mandatory fields with valid data :: ${mandatoryFieldsErrors.join(
        ", "
      )}`,
    });
  }
});

//creating card
app.post("/create/card", async (req, res) => {
  let body = req.body; //request body
  let mandatoryFieldsErrors = utility.mandatoryFields(body, "card"); //check mandatory fields

  if (!mandatoryFieldsErrors.length) {
    //if no mandatory fields errors
    let user = await dbQuery.getEntityDetails(db, body, "user"); //checking whether user exists or not with the given email ID
    if (user.length) {
      let cards = await dbQuery.getEntityDetails(db, body, "card"); //get existed card with card number
      let card = cards.filter((eachCard) => {
        return body.cardNumber == eachCard.card_number;
      });
      console.log(card);
      if (!card.length) {
        //if no card exists
        //body.cardNumber = await datahash.encryptData(body.cardNumber, 10); //encrypt card number
        body.nameOnCard = body.nameOnCard.toUpperCase();
        let lastRowOfEntity = await dbQuery.getLastRowOfEntity(db, "card");
        let id = lastRowOfEntity.length ? lastRowOfEntity[0].id + 1 : 1;
        body.id = id;
        body.userID = user[0].id;
        let dbResponse = await dbQuery.createRowinEntity(db, body, "card");
        res.status(200).send({
          isSuccessful: true,
          message: `Card is created successfully with the id :: ${id}`,
        });
      } else {
        res.status(400).send({
          isSuccessful: false,
          message: "Card Number already exists",
        });
      }
    } else {
      res.status(400).send({
        isSuccessful: "false",
        message: "No user exists with the given Email",
      });
    }
  } else {
    //if mandatory fields errors
    res.status(400).send({
      isSuccessful: false,
      message: `Please provide mandatory fields with valid data :: ${mandatoryFieldsErrors.join(
        ", "
      )}`,
    });
  }
});

//creating transaction
app.post("/transaction", (req, res) => {});
