//const nodemailer = require("nodemailer");
import nodemailer from "nodemailer";

const userGmail = "trabajo01!@gmail.com"
const passGmail = "proof"

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.example.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});