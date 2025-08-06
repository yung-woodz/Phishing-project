"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import { getCampaigns } from "@/service/campaign.service";

// ApexChart dinámico
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Utilidad para formatear días
const getLast7Days = () => {
  const today = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return {
      label: date.toLocaleDateString("es-CL", { weekday: "short" }), // 'lun', 'mar', etc.
      date: date.toISOString().slice(0, 10), // YYYY-MM-DD
    };
  });
};

export default function StatisticsChart() {
  const [series, setSeries] = useState([
    { name: "Campañas", data: Array(7).fill(0) },
    { name: "Cliqueados", data: Array(7).fill(0) },
  ]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const days = getLast7Days();
        setCategories(days.map(d => d.label));

        const campaigns = await getCampaigns();
        const campaignsByDate = new Map<string, number>();
        const clicksByDate = new Map<string, number>();

        days.forEach(d => {
          campaignsByDate.set(d.date, 0);
          clicksByDate.set(d.date, 0);
        });

        for (const campaign of campaigns) {
          const date = new Date(campaign.startTime).toISOString().slice(0, 10);
          if (campaignsByDate.has(date)) {
            campaignsByDate.set(date, campaignsByDate.get(date)! + 1);
            clicksByDate.set(date, clicksByDate.get(date)! + (campaign.clicked || 0));
          }
        }

        setSeries([
          { name: "Campañas", data: Array.from(campaignsByDate.values()) },
          { name: "Cliqueados", data: Array.from(clicksByDate.values()) },
        ]);
      } catch (err) {
        console.error("Error al cargar datos del gráfico:", err);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: { fontSize: "0px" },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Estadísticas
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Campañas y clics durante los últimos 7 días
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
         {/*  <ChartTab /> */}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
