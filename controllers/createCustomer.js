import { getData, createRowInTable } from "../database.js";
import { checkMandatoryFields, checkForDuplicateFields } from "../utility.js";
import { encryptData } from "../datahash.js";
import dotenv from "dotenv";

dotenv.config();
const saltrounds = parseInt(process.env.saltrounds);

export default async (req, res) => {
  let body = req.body; //request body
  let mandatoryFieldsErrors = checkMandatoryFields(body, "user"); //check mandatory fields
  if (!mandatoryFieldsErrors.length) {
    //if no mandatory fields errors
    const users = await getData("user"); //get users data
    let encryptedPassword = await encryptData(body.password, saltrounds); //encrypt password
    body.password = encryptedPassword;
    let id = users.length ? users[users.length - 1].id + 1 : 1;
    body.id = id;
    if (users.length) {
      //if users data exists then check for duplicate fields
      const duplicateFieldsErrors = checkForDuplicateFields(
        body,
        users,
        "user"
      );

      if (!duplicateFieldsErrors.length) {
        //if no duplicate fields errors
        let result = await createRowInTable(body, "user"); //create a row in user table
        //sending response to client
        res.status(200).send({
          isSuccessful: true,
          message: `User is created successfully with the id :: ${id}`,
        });
      } else {
        //sending response to client indicating duplicate fields
        res.status(400).send({
          isSuccessful: false,
          message: `${duplicateFieldsErrors.join(", ")} already exists`,
        });
      }
    } else {
      let result = await createRowInTable(body, "user"); //create a row in user table
      //sending successful response to client
      res.status(200).send({
        isSuccessful: true,
        message: `User is created successfully with the id :: ${id}`,
      });
    }
  } else {
    //if mandatory fields errors exists
    //sending response to client indicating mandatory fields errors
    res.status(400).send({
      isSuccessful: false,
      message: `Please provide mandatory fields :: ${mandatoryFieldsErrors.join(
        ", "
      )}`,
    });
  }
};
