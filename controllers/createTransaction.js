import { checkMandatoryFields, processCashback } from "../utility.js";
import {
  getData,
  createRowInTable,
  checkEmailAndCardNumberValid,
  getRewardRule,
} from "../database.js";

export default async (req, res) => {
  let body = req.body;
  let result = await checkEmailAndCardNumberValid(body);
  let mandatoryFieldsErrors = checkMandatoryFields(body, "transaction");
  if (!mandatoryFieldsErrors.length) {
    if (result != undefined) {
      result.trans_amount = body.transAmount;
      let cashbackrule = await getRewardRule(result);
      let trans_history_data = await getData("trans_history");
      let trans_id = trans_history_data.length
        ? trans_history_data[trans_history_data.length - 1].id + 1
        : 1;
      result.trans_id = trans_id;
      if (cashbackrule != undefined) {
        cashbackrule.trans_amount = body.transAmount;
        let cashback = processCashback(cashbackrule, "trans_history");
        result.cashback = cashback;
      } else {
        result.cashback = 0;
      }
      let response = await createRowInTable(result, "trans_history");
      res.status(200).send({
        isSuccessful: true,
        message: `Transaction is successful with cashback :: ${result.cashback}`,
      });
    } else {
      res
        .status(400)
        .send({ isSuccessful: false, message: "Invalid Email or Card Number" });
    }
  } else {
    res.status(400).send({
      isSuccessful: false,
      message: `Mandatory fields should not be empty :: ${mandatoryFieldsErrors.join(
        ", "
      )}`,
    });
  }
};
