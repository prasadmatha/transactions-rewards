import { checkMandatoryFields, processCashback } from "../utility.js";
import {
  getData,
  createRowInTable,
  checkEmailAndCardNumberValid,
  getRewardRule,
} from "../database.js";

export default async (req, res) => {
  let body = req.body;
  let userAndCardObject = await checkEmailAndCardNumberValid(body); //check email and card number are valid or not?
  let mandatoryFieldsErrors = checkMandatoryFields(body, "transaction"); //check for mandatory fields errors
  if (!mandatoryFieldsErrors.length) {
    //if no mandatory fields errors
    if (userAndCardObject != undefined) {
      //if email and card number are valid
      userAndCardObject.trans_amount = body.transAmount;
      let rewardRule = await getRewardRule(userAndCardObject); //get reward rule based on card type and transaction amount
      let trans_history_data = await getData("trans_history"); //get trans_history data
      let trans_id = trans_history_data.length
        ? trans_history_data[trans_history_data.length - 1].id + 1
        : 1; //id of a new transaction
      userAndCardObject.trans_id = trans_id;
      if (rewardRule != undefined) {
        //if reward rule found
        rewardRule.trans_amount = body.transAmount;
        let cashback = processCashback(rewardRule, "trans_history"); //calculate cashback
        userAndCardObject.cashback = cashback;
      } else {
        userAndCardObject.cashback = 0; //if reward rule not found
      }
      let response = await createRowInTable(userAndCardObject, "trans_history"); //create a row in trans_history table
      //sending successful response to client
      res.status(200).send({
        isSuccessful: true,
        message: `Transaction is successful with cashback :: ${userAndCardObject.cashback}`,
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
