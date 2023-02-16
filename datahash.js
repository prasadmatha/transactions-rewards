let bcrypt = require("bcrypt");

module.exports.encryptData = async function encryptData(data, saltRounds) {
  let encryptedData = await bcrypt.hash(data, saltRounds);
  return encryptedData;
};

module.exports.compare = async function compare(data, encryptData) {
  let result = await bcrypt.compare(data, encryptData);
  return result;
};
