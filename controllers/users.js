import { getData } from "../database.js";

export default async (req, res) => {
  const rows = await getData("user"); //get users data
  //sending successful response to client with users data
  res.status(200).send({
    isSuccessful: true,
    message: "Received users details successfully",
    response: rows,
  });
};
