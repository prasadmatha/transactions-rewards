import { getData } from "../database.js";

export default async (req, res) => {
  const rows = await getData("card"); //get cards data
  //sending successful response to client with cards data
  res.status(200).send({
    isSuccessful: true,
    message: "Received cards details successfully",
    response: rows,
  });
};
