import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process'; // PRUEBA
import { HOST } from '../config/configEnv.js';
import { AppDataSource } from '../config/configDb.js';
import CampaignSchema from '../entity/campaign.entity.js';
import { urlValidation } from '../validations/email.validation.js';
import { injectedScriptContent } from '../utils/injectedScriptContent.js';
import {
    handleErrorClient,
} from "../handlers/responseHandlers.js";

export const clonePage = async (req, res) => {
    try {

        const { body } = req;

        const { name, url } = body;

        if (!name || !url) return res.status(400).json({ message: 'name y url requeridos' });

        const { error } = urlValidation.validate(body);
        
        if (error) {
            console.error(error)
            return handleErrorClient(res, 400, "Error al validar URL", error.message);
        }

        const campaignRepository = AppDataSource.getRepository(CampaignSchema.options.name);

        const newCampaign = campaignRepository.create({
            campaignName: name,
            pageUrl: url,
        });

        await campaignRepository.save(newCampaign);
        console.log(`Campaña '${name}' guardada en la DB con ID: ${newCampaign.id}`);

        const browser = await puppeteer.launch({
		    args: ['--no-sandbox', '--disable-setid-sandbox']
	    });

        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        const scriptToInject = injectedScriptContent(HOST);

        await page.evaluate((scriptContent) => {
            const toAbsolute = (u) => new URL(u, location.href).href;

            document.querySelectorAll('link[href]').forEach((el) => {
                const href = el.getAttribute('href');
                if (href && !href.startsWith('http')) el.href = toAbsolute(href);
            });

            document.querySelectorAll('script[src]').forEach((el) => {
                const src = el.getAttribute('src');
                if (src && !src.startsWith('http')) el.src = toAbsolute(src);
            });

            document.querySelectorAll('img[src]').forEach((el) => {
                const src = el.getAttribute('src');
                if (src && !src.startsWith('http')) el.src = toAbsolute(src);
            });

            document.querySelectorAll('form').forEach((form) => {
                form.setAttribute('action', 'javascript:void(0)');
                form.setAttribute('onsubmit', 'return false');
            });

            const script = document.createElement('script');
            script.innerHTML = scriptContent;
            document.body.appendChild(script);
        }, scriptToInject);

        const html = await page.content();
        
        const folderPath = path.resolve(`../frontend/public/${name}`);
        fs.mkdirSync(folderPath, { recursive: true });
        fs.writeFileSync(`${folderPath}/index.html`, html);

        await browser.close();

	// PRUEBA

	exec('pm2 restart 1', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al reiniciar frontend: ${error.message}`);
            }
            if (stderr) {
                console.error(`Stderr al reiniciar frontend: ${stderr}`);
            }
            console.log(`Frontend reiniciado con éxito: ${stdout}`);
        });

        res.status(200).json({ message: `Página clonada como ${name}` });
    } catch (error) {
        console.error('Error al clonar página:', error);
        res.status(500).json({ message: 'Error al clonar página' });
    }
};
