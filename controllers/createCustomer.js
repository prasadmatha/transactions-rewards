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
  let mandatoryFieldsErrors = checkMandatoryFields(body, "user"); //check mandatory fields
  if (!mandatoryFieldsErrors.length) {
    const users = await getData("user");
    let encryptedPassword = await encryptData(body.password, saltrounds);
    body.password = encryptedPassword;
    let id = users.length ? users[users.length - 1].id + 1 : 1;
    body.id = id;
    if (users.length) {
      const duplicateFieldsErrors = checkForDuplicateFields(
        body,
        users,
        "user"
      );

      if (!duplicateFieldsErrors.length) {
        let result = await createRowInTable(body, "user");
        console.log(result);
        res.send({
          isSuccessful: true,
          message: `User is created successfully with the id :: ${id}`,
        });
      } else {
        res.status(400).send({
          isSuccessful: false,
          message: `${duplicateFieldsErrors.join(", ")} already exists`,
        });
      }
    } else {
      let result = await createRowInTable(body, "user");
      res.send({
        isSuccessful: true,
        message: `User is created successfully with the id :: ${id}`,
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
