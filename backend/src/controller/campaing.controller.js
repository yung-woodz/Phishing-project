import { AppDataSource } from '../config/configDb.js'; // Importa AppDataSource desde tu nuevo archivo de configuración

export const getCampaigns = async (req, res) => {
    try {
        // Obtener el repositorio de campañas usando el nombre de la entidad como string
        const campaignRepository = AppDataSource.getRepository("Campaign");
        
        // Obtener todas las campañas, ordenadas por fecha de inicio descendente
        const campaigns = await campaignRepository.find({
            order: {
                startTime: "DESC" // Ordenar por fecha de inicio, las más recientes primero
            }
        });

        res.status(200).json(campaigns);
    } catch (error) {
        console.error('Error al obtener campañas:', error);
        res.status(500).json({ message: 'Error al obtener campañas', details: error.message });
    }
};
