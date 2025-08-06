import { notFound } from "next/navigation";
import CampaignDetailsTable from "@/components/tables/CampaignDetailsTable";
import fs from "fs/promises";
import path from "path";

interface Props {
  params: {
    campaignName: string;
  };
}

interface RawCampaignDetail {
  email: string;
  clicked: boolean;
  submittedPassword: boolean;
  date: string;
}

interface CampaignDetail {
  email: string;
  clicked: "Sí" | "No";
  submittedPassword: "Sí" | "No";
  date: string;
}

async function getDetailsForCampaign(campaignName: string): Promise<CampaignDetail[]> {
    const backendLogsPath = path.join(process.cwd(), "..", "backend", "logs");
    const clickLogPath = path.join(backendLogsPath, "clicks.log");
    const credLogPath = path.join(backendLogsPath, "credentials.log");

    const [clickLogRaw, credLogRaw] = await Promise.all([
        fs.readFile(clickLogPath, "utf-8"),
        fs.readFile(credLogPath, "utf-8"),
    ]);

    const detailsMap = new Map<string, RawCampaignDetail>();

    // Procesar clicks
    clickLogRaw.split("\n").forEach((line) => {
        if (line.includes(`Campaign: ${campaignName}`)) {
        const emailMatch = line.match(/User: ([^ ]+)/);
        const dateMatch = line.match(/^(.+?) \|/);

        if (emailMatch && dateMatch) {
            const email = decodeURIComponent(emailMatch[1]);
            const date = dateMatch[1];

            detailsMap.set(email, {
            email,
            clicked: true,
            submittedPassword: false,
            date,
            });
        }
        }
    });

    // Procesar credenciales
    credLogRaw.split("\n").forEach((line) => {
        if (line.includes(`"${campaignName}"`) || line.includes(`Campaign: ${campaignName}`)) {
        const match = line.match(/Capturado: ({.+?})/);
        const dateMatch = line.match(/Fecha: (.+)/);

        if (match && dateMatch) {
            const json = JSON.parse(match[1]);
            const email = json.rut_aux || json.rut || "desconocido";
            const hasPassword = typeof json.clave === 'string' && json.clave.trim().length > 0;
            const date = dateMatch[1];

            const decodedEmail = decodeURIComponent(email);

            const prev = detailsMap.get(decodedEmail) || {
            email: decodedEmail,
            clicked: false,
            submittedPassword: false,
            date,
            };

            detailsMap.set(decodedEmail, {
            ...prev,
            submittedPassword: hasPassword,
            date,
            });
        }
        }
    });

    return Array.from(detailsMap.values()).map((detail) => ({
        email: detail.email,
        clicked: detail.clicked ? "Sí" : "No",
        submittedPassword: detail.submittedPassword ? "Sí" : "No",
        date: detail.date,
    }));
}

export default async function CampaignDetailsPage(props: Props) {
    const { campaignName } = await props.params;

    const data = await getDetailsForCampaign(campaignName);

    if (!data || data.length === 0) return notFound();

    return (
        <div className="p-6">
        <h1 className="text-xl font-bold mb-4 dark:text-white/80">
            Detalles de la campaña: <span className="dark:text-white/60">{campaignName}</span>
        </h1>
        <CampaignDetailsTable data={data} />
        </div>
    );
}