import { checkMandatoryFields, processCashback } from "../utility.js";
import {
  getData,
  createRowInTable,
  checkEmailAndCardNumberValid,
  getRewardRule,
} from "../database.js";

export default async (req, res) => {
  let body = req.body;
  let result = await checkEmailAndCardNumberValid(body); //check email and card number are valid or not?
  let mandatoryFieldsErrors = checkMandatoryFields(body, "transaction"); //check for mandatory fields errors
  if (!mandatoryFieldsErrors.length) {
    //if no mandatory fields errors
    if (result != undefined) {
      //if email and card number are valid
      result.trans_amount = body.transAmount;
      let cashbackrule = await getRewardRule(result); //get reward rule based on card type and transaction amount
      let trans_history_data = await getData("trans_history"); //get trans_history data
      let trans_id = trans_history_data.length
        ? trans_history_data[trans_history_data.length - 1].id + 1
        : 1; //id of a new transaction
      result.trans_id = trans_id;
      if (cashbackrule != undefined) {
        //if reward rule found
        cashbackrule.trans_amount = body.transAmount;
        let cashback = processCashback(cashbackrule, "trans_history"); //calculate cashback
        result.cashback = cashback;
      } else {
        result.cashback = 0; //if reward rule not found
      }
      let response = await createRowInTable(result, "trans_history"); //create a row in trans_history table
      //sending successful response to client
      res.status(200).send({
        isSuccessful: true,
        message: `Transaction is successful with cashback :: ${result.cashback}`,
      });
    } else {
      //sending response to client indicating invalid email or card number
      res.status(400).send({
        isSuccessful: false,
        message: "Invalid Email or Card Number",
      });
    }
  } else {
    //sending response to client to indicating mandatory fields errors
    res.status(400).send({
      isSuccessful: false,
      message: `Mandatory fields should not be empty :: ${mandatoryFieldsErrors.join(
        ", "
      )}`,
    });
  }
};
