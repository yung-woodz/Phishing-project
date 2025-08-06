"use strict";
import { Router } from "express";
import { login, logout, register } from "../controller/auth.controller.js";

const router = Router();

router
  .post("/login", login)
  .post("/register", register)
  .post("/logout", logout);

export default router;