import { getData, createRowInTable } from "../database.js";
import { checkMandatoryFields, checkForDuplicateFields } from "../utility.js";
import { encryptData, compare } from "../datahash.js";
import dotenv from "dotenv";

dotenv.config();
const saltrounds = parseInt(process.env.saltrounds);

export default async (req, res) => {
  let body = req.body; //request body
  let mandatoryFieldsErrors = checkMandatoryFields(body, "card"); //check mandatory fields
  if (!mandatoryFieldsErrors.length) {
    //if no mandatory fields errors
    let users = await getData("user"); //get users data
    //check if the user found in database or not
    let isUserExists = users.filter(
      (user) => user.email == body.email.toLowerCase()
    );
    if (isUserExists.length) {
      //if user found
      let userID = isUserExists[0].id; //user_id of user
      const cards = await getData("card"); //get cards data
      //let encryptedCardNumber = await encryptData(body.cardNumber, saltrounds);
      let id = cards.length ? cards[cards.length - 1].id + 1 : 1; //
      body.id = id;
      body.userID = userID;
      if (cards.length) {
        //if cards data exists in database then check for duplicate fields like cardNumber etc....
        const duplicateFieldsErrors = checkForDuplicateFields(
          body,
          cards,
          "card"
        );
        if (!duplicateFieldsErrors.length) {
          //if no duplicate fields errors then create row in card table and send successful response to client
          //body.cardNumber = encryptedCardNumber;
          let result = await createRowInTable(body, "card");
          res.send({
            isSuccessful: true,
            message: `Card is saved successfully with the id :: ${id}`,
          });
        } else {
          //if duplicate fields errors exists then send response to client indicating that duplicate fields.
          res.status(400).send({
            isSuccessful: false,
            message: `${duplicateFieldsErrors.join(", ")} already exists`,
          });
        }
      } else {
        //if cards data not exists in database then create a row in card table directly with the data in request.
        //body.cardNumber = encryptedCardNumber;
        let result = await createRowInTable(body, "card"); //creating a row in card table
        //sending successful response to client
        res.send({
          isSuccessful: true,
          message: `Card is saved successfully with the id :: ${id}`,
        });
      }
    } else {
      //if no user found with the given emailID in the body
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
