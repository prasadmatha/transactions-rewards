import bcrypt from "bcrypt";

export const encryptData = async function encryptData(data, saltRounds) {
  let encryptedData = await bcrypt.hash(data, saltRounds);
  return encryptedData;
};

export const compare = async function compare(data, encryptData) {
  let result = await bcrypt.compare(data, encryptData);
  return result;
};
