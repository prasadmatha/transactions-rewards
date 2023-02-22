import { getData } from "../database.js";

export default async (req, res) => {
  const rows = await getData("trans_history");
  res.status(200).send(rows);
};
