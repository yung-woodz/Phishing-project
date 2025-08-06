// BasicTableOne.tsx
import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";

export interface Campaign {
  id: string;
  campaignName: string;
  pageUrl: string;
  startTime: Date;
  totalSent: number;
  clicked: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BasicTableOneProps {
  campaigns: Campaign[]; 
}

export default function BasicTableOne({ campaigns }: BasicTableOneProps) {

  const getCampaignStatus = (startTime: Date): 'Activo' | 'Expirado' => {
    const fourHoursInMillis = 4 * 60 * 60 * 1000; 
    const expirationTime = new Date(startTime.getTime() + fourHoursInMillis);
    return new Date() < expirationTime ? 'Activo' : 'Expirado';
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]"> {/* Ajusta el ancho mínimo según sea necesario para las columnas */}
          <Table>
            {/* Encabezado de la tabla */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Nombre Campaña
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Página
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Fecha
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Estado
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Total Enviados
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Cliqueados
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Cuerpo de la tabla */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {campaigns.length === 0 ? (
                // Mostrar mensaje si no hay campañas
                <TableRow>
                  <td colSpan={6} className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                    No hay campañas disponibles.
                  </td>
                </TableRow>
              ) : (
                // Mapear y renderizar cada campaña
                campaigns.map((campaign) => {
                  const status = getCampaignStatus(campaign.startTime); // Calcular el estado
                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <Link
                          href={`/campaign/${campaign.campaignName}/details`}
                          className="block font-medium text-brand-500 text-theme-sm hover:underline dark:text-brand-400"
                        >
                          {campaign.campaignName}
                        </Link>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {campaign.pageUrl} {/* Muestra la URL de la página clonada */}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {campaign.startTime.toLocaleString()} {/* Formatea y muestra la fecha y hora de inicio */}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={
                            status === "Activo"
                              ? "success"
                              : "error"
                          }
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {campaign.totalSent} {/* Muestra el total de correos enviados */}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {campaign.clicked} {/* Muestra el total de clics */}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
