import { getData, createRowInTable } from "../database.js";
import { checkMandatoryFields, checkForDuplicateFields } from "../utility.js";
import dotenv from "dotenv";

dotenv.config();

export default async (req, res) => {
  let body = req.body; //request body
  let mandatoryFieldsErrors = checkMandatoryFields(body, "card"); //check mandatory fields
  let duplicateFieldsErrors = [];
  if (!mandatoryFieldsErrors.length) {
    //if no mandatory fields errors
    let users = await getData("user"); //get users data
    //check if the user found in database or not with the given emailID in the request body
    let userExists = users.filter(
      (user) => user.email == body.email.toLowerCase()
    );
    if (userExists.length) {
      //if user found
      let userID = userExists[0].id; //user_id of user
      const cards = await getData("card"); //get cards data
      let id = cards.length ? cards[cards.length - 1].id + 1 : 1; // id of new card entry
      body.id = id;
      body.userID = userID;
      if (cards.length) {
        //if cards data exists then check for duplicate fields errors
        duplicateFieldsErrors = checkForDuplicateFields(body, cards, "card");
      }
      if (!duplicateFieldsErrors.length) {
        //if no duplicate fields errors
        let result = await createRowInTable(body, "card"); //create a row in card table
        //sending successful response to client
        res.status(200).send({
          isSuccessful: true,
          message: `Card is saved successfully with the id :: ${id}`,
        });
      } else {
        //if duplicate fields errors then sending response to client indicating bad request
        res.status(400).send({
          isSuccessful: true,
          message: `${duplicateFieldsErrors.join(", ")} already exists`,
        });
      }
    } else {
      //if no user found with the given emailID in the body then sending response to client indicating user not found (404)
      res.status(404).send({
        isSuccessful: false,
        message: `No user exists with the email id :: ${body.email}`,
      });
    }
  } else {
    //if manadatory fields errors exists
    res.status(400).send({
      isSuccessful: false,
      message: `Please provide mandatory fields :: ${mandatoryFieldsErrors.join(
        ", "
      )}`,
    });
  }
};
