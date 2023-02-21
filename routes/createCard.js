import express from "express";
const router = express.Router();
import createCard from "../controllers/createCard.js";
router.post("/create/card", createCard);
export default router;
