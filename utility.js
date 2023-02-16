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
