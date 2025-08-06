"use strict";
import { Router } from "express";
import emailRoutes from "./email.routes.js";
import cloneRoutes from "./clone.routes.js";
import captureRoutes from "./capture.routes.js";
import campaignRoutes from "./campaign.routes.js"
import authRoutes from "./auth.routes.js";

const router = Router();

router.use("/email", emailRoutes);
router.use("/auth", authRoutes)
router.use("/clone", cloneRoutes);
router.use('/capture', captureRoutes);
router.use('/campaigns', campaignRoutes);

export default router;
