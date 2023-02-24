import { getData } from "../database.js";

export default async (req, res) => {
  const rows = await getData("trans_history"); //get transactions data
  //sending successful response to client with transactions history data
  res.status(200).send({
    isSuccessful: true,
    message: "Received user details successfully",
    response: rows,
  });
};
