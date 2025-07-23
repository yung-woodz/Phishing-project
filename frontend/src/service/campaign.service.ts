import axios from './root.service'; // Importa la instancia de axios preconfigurada
import { Campaign as CampaignInterface } from '@/components/tables/BasicTableOne'; // Importa la interfaz Campaign para tipado

interface CampaignApiResponse extends Omit<CampaignInterface, 'startTime' | 'createdAt' | 'updatedAt'> {
  startTime: string;
  createdAt: string;
  updatedAt: string | null; // updated_at puede ser null si no se ha actualizado
}

/**
 * Obtiene el historial de campañas desde el backend.
 * Este servicio solo invoca la API y adapta ligeramente los datos para el frontend.
 * @returns {Promise<CampaignInterface[]>} Una promesa que resuelve con un array de objetos Campaign.
 * @throws {Error} Si la solicitud a la API falla.
 */
export const getCampaigns = async (): Promise<CampaignInterface[]> => {
  try {
    const res = await axios.get<CampaignApiResponse[]>('/campaigns/campaigns');
    const data = res.data;

    const parsedCampaigns: CampaignInterface[] = data.map(campaign => ({
      ...campaign,
      startTime: new Date(campaign.startTime),
      createdAt: new Date(campaign.createdAt),
      updatedAt: campaign.updatedAt ? new Date(campaign.updatedAt) : new Date(campaign.createdAt), 
    }));

    return parsedCampaigns;
  } catch (err) {
    console.error('[campaign.service.ts] Error al obtener campañas:', err);
    throw err; 
  }
};