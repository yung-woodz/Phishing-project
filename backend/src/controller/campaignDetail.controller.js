// controllers/campaignDetail.controller.js
import fs from "fs";
import path from "path";

export const getCampaignDetails = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const clicksPath = path.resolve("logs", "clicks.log");
    const credentialsPath = path.resolve("logs", "credentials.log");

    const clickLines = fs.readFileSync(clicksPath, "utf-8").split("\n").filter(Boolean);
    const credentialLines = fs.readFileSync(credentialsPath, "utf-8").split("\n").filter(Boolean);

    const detailsMap = new Map();

    // Leer clics
    for (const line of clickLines) {
      if (line.includes(`Campaign: ${campaignId}`)) {
        const [timestamp, , campaign, userPart] = line.split(" | ");
        const user = userPart.split(": ")[1];

        if (!detailsMap.has(user)) {
          detailsMap.set(user, {
            email: user,
            clicked: "Sí",
            submittedPassword: "No",
            date: new Date(timestamp).toLocaleString(),
          });
        } else {
          detailsMap.get(user).clicked = "Sí";
        }
      }
    }

    // Leer contraseñas
    for (const line of credentialLines) {
      const match = line.match(/Capturado: (.+?)\s+\| IP/);
      if (match) {
        const json = JSON.parse(match[1]);
        const emailLikeField = json.rut_aux || json.email || json.rut || json.user || json.username;

        if (!emailLikeField) continue;

        const user = emailLikeField.trim();
        const dateMatch = line.match(/\| Fecha: (.+)$/);
        const date = dateMatch ? new Date(dateMatch[1]).toLocaleString() : null;

        if (!detailsMap.has(user)) {
          detailsMap.set(user, {
            email: user,
            clicked: "No",
            submittedPassword: "Sí",
            date,
          });
        } else {
          detailsMap.get(user).submittedPassword = "Sí";
          detailsMap.get(user).date = detailsMap.get(user).date || date;
        }
      }
    }

    const results = Array.from(detailsMap.values());
    res.status(200).json({ data: results });
  } catch (error) {
    console.error("Error al leer detalles:", error);
    res.status(500).json({ message: "Error al obtener detalles de campaña." });
  }
};
