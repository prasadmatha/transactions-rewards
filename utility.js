const { option } = require("yargs");
let regex = require("./regex");

//mandatory fields of entities
let mandatoryFields = {
  user: ["name", "mobile", "email", "password"],
  card: ["nameOnCard", "cardType", "cardNumber", "email", "expDate", "cvv"],
};

//unique fields of entities
let uniqueFields = {
  user: ["mobile", "email"],
  card: ["cardNumber"],
};

//check for mandatory fields
module.exports.mandatoryFields = checkMandatoryFields = (body, entity) => {
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
module.exports.checkDuplicateFields = checkForDuplicateFields = (
  body,
  entityData,
  entity
) => {
  let errors = [];
  entityData.forEach((user) => {
    uniqueFields[entity].forEach((key) => {
      let value = body[key];
      value = isNaN(value) ? value.toLowerCase() : value;
      if (value == user[key]) {
        errors.push(key);
      }
    });
  });
  return errors;
};

//process cashback for a transaction
module.exports.processCashback = function processCashback(rule, TA) {
  let cashback;
  if (rule.startsWith("min")) {
    let [option1, option2, option3] = rule.split(" ");
    option2 = parseInt(option2);
    option3 = (parseInt(option3.split("%")[0]) * TA) / 100;
    cashback = Math.min(option2, option3);
  } else if (rule.startsWith("max")) {
    let [option1, option2, option3] = rule.split(" ");
    option2 = parseInt(option2);
    option3 = (parseInt(option3.split("%")[0]) * TA) / 100;
    cashback = Math.max(option2, option3);
  } else if (rule.endsWith("%_TA") && rule.includes(",")) {
    let [option1, option2] = rule.split(",");
    option1 = parseInt(option1);
    option2 = (parseInt(option2.split("%")[0]) * TA) / 100;
    cashback = option1 + option2;
  } else if (rule.endsWith("%_TA")) {
    rule = parseInt(rule.split("_")[0]);
    cashback = (rule * TA) / 100;
  } else {
    rule = parseInt(rule);
    cashback = rule;
  }
  return Math.ceil(cashback);
};
