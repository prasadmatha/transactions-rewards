import { getData } from "../database.js";

export default async (req, res) => {
  const rows = await getData("user");
  res.status(200).send(rows);
};
