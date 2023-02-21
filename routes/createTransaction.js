import express from "express";
const router = express.Router();
import createTransaction from "../controllers/createTransaction.js";
router.post("/create/transaction", createTransaction);
export default router;
