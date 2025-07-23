// BasicTableOne.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell, // Mantener la importación para el resto de las celdas
  TableHeader,
  TableRow,
} from "../ui/table"; // Asegúrate de que estos componentes existan en tu proyecto

import Badge from "../ui/badge/Badge"; // Asegúrate de que el componente Badge esté disponible

// Define la interfaz para los datos de la campaña
// Esta interfaz debe coincidir con la estructura de datos que tu backend envía
// y que el campaign.service.ts transforma a objetos Date.
export interface Campaign {
  id: string; // Identificador único de la campaña (UUID de PostgreSQL)
  campaignName: string; // Nombre de la campaña (corresponde a 'name' del formulario)
  pageUrl: string; // URL de la página clonada (corresponde a 'url' del formulario)
  startTime: Date; // Fecha y hora de inicio de la campaña (ya convertida a objeto Date por el servicio)
  totalSent: number; // Total de correos enviados
  clicked: number; // Total de clics en el enlace de rastreo
  createdAt: Date; // Marca de tiempo de creación del registro
  updatedAt: Date; // Marca de tiempo de última actualización del registro
}

// Propiedades para el componente BasicTableOne
interface BasicTableOneProps {
  campaigns: Campaign[]; // Array de campañas a mostrar
}

export default function BasicTableOne({ campaigns }: BasicTableOneProps) {
  // Función para determinar el estado de la campaña
  // Una campaña se considera 'Expired' si han pasado más de 4 horas desde su startTime.
  const getCampaignStatus = (startTime: Date): 'Active' | 'Expired' => {
    const fourHoursInMillis = 4 * 60 * 60 * 1000; // 4 horas en milisegundos
    const expirationTime = new Date(startTime.getTime() + fourHoursInMillis);
    return new Date() < expirationTime ? 'Active' : 'Expired';
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
                  Campaign Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Page
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Total Sent
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Clicked
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Cuerpo de la tabla */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {campaigns.length === 0 ? (
                // Mostrar mensaje si no hay campañas
                <TableRow>
                  {/* CORRECCIÓN: Usar <td> nativo para aplicar colSpan */}
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
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {campaign.campaignName} {/* Muestra el nombre de la campaña */}
                        </span>
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
                            status === "Active"
                              ? "success" // Color para estado 'Active'
                              : "error"   // Color para estado 'Expired'
                          }
                        >
                          {status} {/* Muestra el estado calculado */}
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
