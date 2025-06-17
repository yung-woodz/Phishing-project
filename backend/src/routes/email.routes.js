import express from "express";
import { sendCustomEmail, trackClick, simularLogin } from "../controller/email.controller.js";

const router = express.Router();

router.post("/send", sendCustomEmail);
router.get("/track/:campaignId/:userId", trackClick);
router.post("/login-simulacion", simularLogin);

export default router;