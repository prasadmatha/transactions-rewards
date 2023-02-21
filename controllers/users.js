import { getData } from "../database.js";

export default async (req, res) => {
  const rows = await getData("user");
  res.send(rows);
};
