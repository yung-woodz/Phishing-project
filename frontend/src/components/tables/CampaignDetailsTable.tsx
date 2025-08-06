import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface CampaignDetail {
  email: string;
  clicked: "Sí" | "No";
  submittedPassword: "Sí" | "No";
  date: string;
}

interface Props {
  data: CampaignDetail[];
}

export default function CampaignDetailsTable({ data }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Email
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Hizo clic
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Ingresó contraseña
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Fecha
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.length === 0 ? (
                <TableRow>
                  <td
                    colSpan={4}
                    className="px-5 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No hay datos disponibles.
                  </td>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-white/90">
                      {item.email}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-white/90">
                      {item.clicked}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-white/90">
                      {item.submittedPassword}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-theme-sm text-gray-700 dark:text-white/90">
                      {new Date(item.date).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
