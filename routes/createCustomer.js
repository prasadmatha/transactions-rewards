import express from "express";
const router = express.Router();
import createCustomer from "../controllers/createCustomer.js";
router.post("/create/customer", createCustomer);
export default router;
