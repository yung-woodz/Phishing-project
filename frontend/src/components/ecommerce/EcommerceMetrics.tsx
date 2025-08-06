"use client";

import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { getCampaigns } from "@/service/campaign.service";

export const EcommerceMetrics = () => {
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campaigns = await getCampaigns();

        setTotalCampaigns(campaigns.length);

        const totalClicksSum = campaigns.reduce(
          (sum, c) => sum + (c.clicked || 0),
          0
        );
        setTotalClicks(totalClicksSum);
      } catch (err) {
        console.error("Error al cargar métricas:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Campañas realizadas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Campañas Historicas
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalCampaigns.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      {/* Clicks totales */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Links Cliqueados
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalClicks.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};
