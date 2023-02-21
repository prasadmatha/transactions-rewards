import { checkMandatoryFields, processCashback } from "../utility.js";
import {
  getData,
  createRowInTable,
  getUserWithCardNumber,
} from "../database.js";

export default async (req, res) => {
  let body = req.body;
  let mandatoryFieldsErrors = checkMandatoryFields(body, "transaction"); //check mandatory fields
  if (!mandatoryFieldsErrors.length) {
    let { transAmount } = req.body;
    let result = await getData("reward_rules");
    result = result.filter(
      (each) => each.card_type == body.cardType.toLowerCase()
    );
    let MTA = result[0].MTA; //get minimum transaction amount
    let keys = Object.keys(result[0]); //keys of reward rules row object
    let transactionAmountLimit = undefined;
    let ruleFound = undefined; //to check for cash back rule found for this card
    let ruleApplicable = undefined; //to assign cash back rule of this card
    let userFound = await getUserWithCardNumber(body);
    if (userFound.length) {
      body.user_id = userFound[0].user_id;
      body.card_id = userFound[0].id;
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
              cashback = processCashback(ruleApplicable, transAmount);
              body.cashback = cashback;
            }
          }
        });
        if (ruleFound == undefined) {
          ruleApplicable = result[0]["1000%_MTA"];
          cashback = processCashback(ruleApplicable, transAmount);
          req.body.cashback = cashback;
        }
        let dateTime = new Date().toLocaleString();
        body.dateTime = dateTime;
        let transHistoryData = await getData("trans_history");
        let id = transHistoryData.length
          ? transHistoryData[transHistoryData.length - 1].id + 1
          : 1;
        body.id = id;
        let createRowInTransHistory = await createRowInTable(
          body,
          "trans_history"
        );
        res.status(200).send({
          isSuccessful: true,
          message: `Transaction successful, received cashback :: ${cashback}/-`,
        });
      } else {
        let dateTime = new Date().toLocaleString();
        body.dateTime = dateTime;
        let transHistoryData = await getData("trans_history");
        let id = transHistoryData.length
          ? transHistoryData[transHistoryData.length - 1].id + 1
          : 1;
        body.id = id;
        body.cashback = 0;
        let createRowInTransHistory = await createRowInTable(
          body,
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
  } else {
    res.status(400).send({
      isSuccessful: false,
      message: `Please provide mandatory fields with valid data :: ${mandatoryFieldsErrors.join(
        ", "
      )}`,
    });
  }
};
