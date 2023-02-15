let mandatoryFields = {
  user: ["name", "mobile", "email", "password"],
  card: ["nameOnCard", "cardType"],
};

let uniqueFields = {
  user: ["mobile", "email"],
  card: ["cardNumber", "expDate"],
};

module.exports.mandatoryFields = checkMandatoryFields = () => {};

module.exports.checkDuplicateFields = checkForDuplicateFields = () => {};
