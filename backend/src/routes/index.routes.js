"use strict";
import { Router } from "express";
import emailRoutes from "./email.routes.js";

const router = Router();

router.use("/email", emailRoutes);

export default router;