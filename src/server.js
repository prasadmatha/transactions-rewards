import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import users from "../routes/users.js";
import cards from "../routes/cards.js";
import trans_history from "../routes/trans_history.js";
import createCustomer from "../routes/createCustomer.js";
import createCard from "../routes/createCard.js";
import createTransaction from "../routes/createTransaction.js";

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT :: ${PORT}`);
});

//get users
app.use("/users", users);

//get cards
app.use("/cards", cards);

//get trans_history
app.use("/transactions", trans_history);

//creating customer
app.post("/create/customer", createCustomer);

//creating card
app.post("/create/card", createCard);

//creating transaction
app.post("/create/transaction", createTransaction);
