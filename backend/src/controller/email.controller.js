import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sendEmail } from "../services/email.services.js";
import {
    handleErrorServer,
    handleSuccess,
    } from "../handlers/responseHandlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const sendCustomEmail = async (req, res) => {

    const { email, subject, message } = req.body;

    const campaignId = "camp1";
    const userId = encodeURIComponent(email);

    const trackingLink = `http://localhost:3000/api/email/track/${campaignId}/${userId}`;

    const htmlMessage = `
        <p>${message}</p>
        <p><a href="${trackingLink}">Haz clic aquí para revisar</a></p>
    `;

    try {
        const info = await sendEmail(
            email,
            subject,
            message,
            htmlMessage
        );

        handleSuccess(res, 200, "Correo enviado con exito!!", info);

    } catch (error) {

        handleErrorServer(res, 500, "Error durante el envío del correo", error.message);
        
    }

}

export const trackClick = (req, res) => {
    const { campaignId, userId } = req.params;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const timestamp = new Date().toISOString();

    const logLine = `${timestamp} | Campaign: ${campaignId} | User: ${userId} | IP: ${ip} | Agent: ${userAgent}\n`;

    const logPath = path.resolve("logs", "clicks.log");
    fs.mkdirSync("logs", { recursive: true }); // asegura carpeta
    fs.appendFile(logPath, logLine, (err) => {
        if (err) console.error("❌ Error al registrar clic:", err);
    });

    res.redirect("https://www.youtube.com/watch?v=zHDLUbssMIw"); // link de prueba
};