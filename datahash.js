import bcrypt from "bcrypt";

//encrypt data
export const encryptData = async function encryptData(data, saltRounds) {
  let encryptedData = await bcrypt.hash(data, saltRounds);
  return encryptedData;
};

//comparing data with encrypted data
export const compare = async function compare(data, encryptData) {
  let result = await bcrypt.compare(data, encryptData);
  return result;
};
