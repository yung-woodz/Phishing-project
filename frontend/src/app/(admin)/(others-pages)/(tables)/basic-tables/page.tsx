'use client';

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne, { Campaign } from "@/components/tables/BasicTableOne"; 
import React, { useState, useEffect } from "react";
import { getCampaigns } from '@/service/campaign.service'; 

export default function BasicTables() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getCampaigns(); 
        setCampaigns(data);

      } catch (err: unknown) {
        console.error("Error al cargar campañas en el componente:", err);
        setError("Error al cargar el historial de campañas. Por favor, inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, []); 

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
        <BasicTableOne campaigns={campaigns} />
      </div>
    </div>
  );
}
