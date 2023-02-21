import express from "express";
const router = express.Router();
import cards from "../controllers/cards.js";
router.get("/", cards);
export default router;
