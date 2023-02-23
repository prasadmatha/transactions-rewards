import { regex } from "./regex.js";

//mandatory fields of entities
let mandatoryFields = {
  user: ["name", "mobile", "email", "password"],
  card: ["nameOnCard", "cardType", "cardNumber", "email", "expDate", "cvv"],
  transaction: ["email", "cardNumber", "transAmount"],
};

//unique fields of entities
let uniqueFields = {
  user: ["mobile", "email"],
  card: ["cardNumber"],
};

//check for mandatory fields
export const checkMandatoryFields = (body, entity) => {
  let errors = [];
  let attribuesOfEntity = Object.keys(body);
  mandatoryFields[entity].forEach((attribute) => {
    if (
      !attribuesOfEntity.includes(attribute) ||
      !regex[attribute].test(body[attribute])
    ) {
      errors.push(attribute);
    }
  });
  let cardTypes = [
    "silver",
    "gold",
    "platinum",
    "titanium",
    "premium",
    "signature",
  ];
  if (entity == "card") {
    if (!cardTypes.includes(body.cardType.toLowerCase())) {
      errors.push("cardType");
    }
  }
  return errors;
};

//check for duplicate fields
export const checkForDuplicateFields = (body, data, entity) => {
  let errors = [];
  data.forEach((each) => {
    uniqueFields[entity].forEach((key) => {
      let value = body[key];
      value = isNaN(value) ? value.toLowerCase() : value;
      if (entity == "card") {
        if (value == each["card_number"]) {
          errors.push("card_number");
        }
      } else if (entity == "user") {
        if (value == each[key]) {
          errors.push(key);
        }
      }
    });
  });
  return errors;
};

//process cashback for a transaction
export const processCashback = (rule) => {
  let cashback;

  switch (rule.reward_type) {
    case "percent":
      cashback = (rule.percent * rule.trans_amount) / 100;
      break;
    case "flat":
      cashback = rule.flat;
      break;
    case "min":
      cashback = Math.min((rule.percent * rule.trans_amount) / 100, rule.flat);
      break;
    case "max":
      cashback = Math.max((rule.percent * rule.trans_amount) / 100, rule.flat);
      break;
    case "sum":
      cashback =
        rule.trans_amount <= rule.to_amount
          ? (rule.percent * rule.trans_amount) / 100 + rule.flat
          : (rule.percent * rule.to_amount) / 100 + rule.flat;
      break;
    default:
      break;
  }
  return Math.ceil(cashback);
};
