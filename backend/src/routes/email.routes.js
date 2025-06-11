import express from "express";
import { sendCustomEmail } from "../controller/email.controller.js";

const router = express.Router();

router.post("/send", sendCustomEmail);

export default router;