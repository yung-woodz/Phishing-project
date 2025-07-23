'use client';

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne, { Campaign } from "@/components/tables/BasicTableOne"; 
import React, { useState, useEffect } from "react";
import { getCampaigns } from '@/service/campaign.service'; 

/*
export const metadata: Metadata = {
  title: "Historial de Campañas",
  description:
    "Historial de Campañas de Phishing realizadas",
  // otras propiedades de metadata
};
*/

export default function BasicTables() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Función asíncrona para obtener los datos de las campañas
    const fetchCampaignData = async () => {
      try {
        setLoading(true); // Activa el estado de carga
        setError(null); // Limpia cualquier error previo
        
        // Llama a la función del servicio para obtener las campañas desde el backend
        const data = await getCampaigns(); 
        setCampaigns(data); // Actualiza el estado con los datos obtenidos

      } catch (err: any) {
        // Captura y registra cualquier error durante la carga
        console.error("Error al cargar campañas en el componente:", err);
        setError("Error al cargar el historial de campañas. Por favor, inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false); // Desactiva el estado de carga al finalizar (éxito o error)
      }
    };

    fetchCampaignData(); // Ejecuta la función de carga de datos al montar el componente
  }, []); // El array de dependencias vacío asegura que useEffect se ejecute solo una vez al montar el componente

  // Renderizado condicional basado en el estado de carga y error
  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Historial de Campañas" />
        <div className="space-y-6 text-center text-gray-500 dark:text-gray-400 py-10">
          Cargando campañas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Historial de Campañas" />
        <div className="space-y-6 text-center text-red-500 dark:text-red-400 py-10">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Historial de Campañas" />
      <div className="space-y-6">
        {/* Pasa las campañas cargadas a BasicTableOne para su visualización */}
        <BasicTableOne campaigns={campaigns} />
      </div>
    </div>
  );
}
