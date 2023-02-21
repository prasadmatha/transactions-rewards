import { getData, createRowInTable } from "../database.js";
import {
  checkMandatoryFields,
  checkForDuplicateFields,
  processCashback,
} from "../utility.js";
import { encryptData, compare } from "../datahash.js";
import dotenv from "dotenv";

dotenv.config();
const saltrounds = parseInt(process.env.saltrounds);

export default async (req, res) => {
  let body = req.body; //request body
  let mandatoryFieldsErrors = checkMandatoryFields(body, "card"); //check mandatory fields
  if (!mandatoryFieldsErrors.length) {
    let users = await getData("user");
    let isUserExists = users.filter(
      (user) => user.email == body.email.toLowerCase()
    );
    if (isUserExists.length) {
      let userID = isUserExists[0].id;
      const cards = await getData("card");
      //let encryptedCardNumber = await encryptData(body.cardNumber, saltrounds);
      let id = cards.length ? cards[cards.length - 1].id + 1 : 1;
      body.id = id;
      body.userID = userID;
      if (cards.length) {
        const duplicateFieldsErrors = checkForDuplicateFields(
          body,
          cards,
          "card"
        );
        console.log(duplicateFieldsErrors);
        if (!duplicateFieldsErrors.length) {
          //body.cardNumber = encryptedCardNumber;
          let result = await createRowInTable(body, "card");
          res.send({
            isSuccessful: true,
            message: `Card is saved successfully with the id :: ${id}`,
          });
        } else {
          res.status(400).send({
            isSuccessful: false,
            message: `${duplicateFieldsErrors.join(", ")} already exists`,
          });
        }
      } else {
        //body.cardNumber = encryptedCardNumber;
        let result = await createRowInTable(body, "card");
        res.send({
          isSuccessful: true,
          message: `Card is saved successfully with the id :: ${id}`,
        });
      }
    } else {
      res.status(404).send({
        isSuccessful: false,
        message: `No user exists with the email id :: ${body.email}`,
      });
    }
  } else {
    res.status(400).send({
      isSuccessful: false,
      message: `Please provide mandatory fields :: ${mandatoryFieldsErrors.join(
        ", "
      )}`,
    });
  }
};
