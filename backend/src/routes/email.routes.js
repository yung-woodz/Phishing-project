import express from "express";
import { sendCustomEmail, trackClick } from "../controller/email.controller.js";

const router = express.Router();

router.post("/send", sendCustomEmail);
router.get("/track/:campaignId/:userId", trackClick);

export default router;