import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { HOST, PORT } from "../config/configEnv.js";
import { emailConfig } from "../config/configEnv.js";
import { sendEmail } from "../services/email.service.js";
import { AppDataSource } from '../config/configDb.js';
import CampaignSchema from '../entity/campaign.entity.js';
import { emailValidation } from "../validations/email.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
    } from "../handlers/responseHandlers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const sendCustomEmail = async (req, res) => {
  const { email, subject, message, fromName } = req.body;
  const sender = `"${fromName}" <${emailConfig.user}>`;

  const emailList = email.split(',').map(e => e.trim()).filter(e => e);
  const results = [];

  // Validación de los datos
  const { error } = emailValidation.validate(req.body);
  if (error) {
    return handleErrorClient(res, 400, "Error al validar envio del correo", error.message);
  }

  try {
    // Obtener la última campaña creada
    const campaignRepository = AppDataSource.getRepository(CampaignSchema.options.name);
    const latestCampaign = await campaignRepository.find({
      order: { createdAt: 'DESC' },
      take: 1,
    });

    if (!latestCampaign || latestCampaign.length === 0) {
      return handleErrorClient(res, 404, "No se encontró ninguna campaña activa.");
    }

    const campaignName = latestCampaign[0]?.campaignName;

    if (!campaignName) {
      return handleErrorClient(res, 500, "La campaña no tiene nombre válido.");
    }

    // Enviar un correo por cada destinatario con su link personalizado
    for (const recipient of emailList) {
      const userId = encodeURIComponent(recipient);
      const trackingLink = `http://${HOST}:${PORT}/api/email/track/${campaignName}/${userId}`;

      const fullMessage = `${message}\n\nAccede aquí: ${trackingLink}`;

      const info = await sendEmail(
        sender,
        recipient,
        subject,
        fullMessage
        /* htmlMessage */
      );

      results.push({ recipient, info });
    }

    handleSuccess(res, 200, "Correos enviados correctamente", results);
  } catch (err) {
    console.error("Error al enviar correos:", err);
    handleErrorServer(res, 500, "Error al enviar los correos", err.message);
  }
};

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

    const redirectURL = `http://${HOST}:3001/${campaignId}/index.html`;
    res.redirect(redirectURL);
};
