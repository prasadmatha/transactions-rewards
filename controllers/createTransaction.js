import { checkMandatoryFields, processCashback } from "../utility.js";
import {
  getData,
  createRowInTable,
  getUserWithCardNumber,
  checkEmailAndCardNumberValid,
  getRewardRule,
} from "../database.js";

export default async (req, res) => {
  let body = req.body;
  let result = await checkEmailAndCardNumberValid(body);
  if (result != undefined) {
    result.trans_amount = body.transAmount;
    let cashbackrule = await getRewardRule(result);
    if (cashbackrule != undefined) {
      console.log(cashbackrule);
      console.log(result);
    }
  } else {
    res
      .status(400)
      .send({ isSuccessful: false, message: "Invalid Email or Card Number" });
  }
};
