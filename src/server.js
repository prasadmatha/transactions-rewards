const express = require("express");
const app = express();
const cors = require("cors");
const dbConnection = require("../dbConnection");
const dbQuery = require("../dbQuery");
const datahash = require("../datahash");
const regex = require("../regex");
const utility = require("../utility");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
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
      //if user exists
      let cards = await dbQuery.getEntityDetails(db, body, "card"); //get existed card with card number
      let card = cards.filter((eachCard) => {
        return body.cardNumber == eachCard.card_number;
      });
      if (!card.length) {
        //if no card exists
        body.nameOnCard = body.nameOnCard.toUpperCase(); //converting nameOnCard to upper case
        let lastRowOfEntity = await dbQuery.getLastRowOfEntity(db, "card"); //get last row of card table
        let id = lastRowOfEntity.length ? lastRowOfEntity[0].id + 1 : 1; //generating id for new card
        body.id = id; //card id
        body.userID = user[0].id; //user id of this card
        let dbResponse = await dbQuery.createRowinEntity(db, body, "card"); //inserting card details in the table
        res.status(200).send({
          isSuccessful: true,
          message: `Card is created successfully with the id :: ${id}`,
        });
      } else {
        //if card already exists
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
app.post("/create/transaction", async (req, res) => {
  let { transAmount } = req.body;
  let result = await dbQuery.getEntityDetails(db, req.body, "reward_rules");
  let MTA = result[0].MTA; //get minimum transaction amount
  let keys = Object.keys(result[0]); //keys of reward rules row object
  let transactionAmountLimit = undefined;
  let ruleFound = undefined; //to check for cash back rule found for this card
  let ruleApplicable = undefined; //to assign cash back rule of this card
  let userFound = await dbQuery.getUserAndCardDetails(db, req.body);
  if (userFound.length) {
    req.body.user_id = userFound[0].user_id;
    req.body.card_id = userFound[0].id;
    if (transAmount >= MTA) {
      let cashback;
      //if transaction amount >= minimum transaction amount
      keys.forEach((each) => {
        //finding rule applicable for cashback
        if (each.endsWith("%_MTA")) {
          let percentageOfMTA = parseInt(each.split("%"));
          if (
            (percentageOfMTA * MTA) / 100 >= transAmount &&
            ruleFound == undefined
          ) {
            transactionAmountLimit = percentageOfMTA; //found x% of miniumum transaction amount to find cash back rule.
            ruleFound = `${transactionAmountLimit}%_MTA`; //rule found
            ruleApplicable = result[0][ruleFound]; //rule assigned
            cashback = utility.processCashback(ruleApplicable, transAmount);
            req.body.cashback = cashback;
          }
        }
      });
      if (ruleFound == undefined) {
        ruleApplicable = result[0]["1000%_MTA"];
        cashback = utility.processCashback(ruleApplicable, transAmount);
        req.body.cashback = cashback;
      }
      let dataTime = new Date().toLocaleString();
      req.body.dateTime = dataTime;
      let transHistoryData = await dbQuery.getLastRowOfEntity(
        db,
        "trans_history"
      );
      let id = transHistoryData.length ? transHistoryData[0].id + 1 : 1;
      req.body.id = id;
      let createRowInTransHistory = await dbQuery.createRowinEntity(
        db,
        req.body,
        "trans_history"
      );
      res.status(200).send({
        isSuccessful: true,
        message: `Transaction successful, received cashback :: ${cashback}/-`,
      });
    } else {
      let dataTime = new Date().toLocaleString();
      req.body.dateTime = dataTime;
      let transHistoryData = await dbQuery.getLastRowOfEntity(
        db,
        "trans_history"
      );
      let id = transHistoryData.length ? transHistoryData[0].id + 1 : 1;
      req.body.id = id;
      req.body.cashback = 0;
      let createRowInTransHistory = await dbQuery.createRowinEntity(
        db,
        req.body,
        "trans_history"
      );
      res
        .status(200)
        .send({ isSuccessful: true, message: "Transaction successful" });
    }
  } else {
    res.status(400).send({
      isSuccessful: false,
      message: "Invalid email or card number or card type",
    });
  }
});

//get total customers
app.get("/users", async (req, res) => {
  let data = await dbQuery.getTotalEntityDetails(db, "user");
  res.status(200).send(data);
});

//get total cards details
app.get("/cards", async (req, res) => {
  let data = await dbQuery.getTotalEntityDetails(db, "card");
  res.status(200).send(data);
});

//get total transactions
app.get("/transactions", async (req, res) => {
  let data = await dbQuery.getTotalEntityDetails(db, "trans_history");
  res.status(200).send(data);
});
