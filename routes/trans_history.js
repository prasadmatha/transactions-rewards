import express from "express";
const router = express.Router();
import trans_history from "../controllers/trans_history.js";
router.get("/", trans_history);
export default router;
