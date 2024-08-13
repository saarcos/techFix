
import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";

import { Equipo } from "@/api/equipoService";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/Components/ui/hover-card";
import { Info } from 'lucide-react';  // Puedes usar otros íconos de lucide-react o FontAwesome

export const columns: ColumnDef<Equipo>[] = [
  {
    accessorKey: "nserie",
    header:"N° Serie",
    cell: ({ row }) => {
      const descripcion = row.original.descripcion;
      const nserie = row.original.nserie;

      return descripcion ? (
          <HoverCard>
              <HoverCardTrigger className="flex items-center font-medium text-customGreen hover:underline cursor-pointer">
                  {nserie}
                  <Info className="ml-2 h-4 w-4 text-customGreen" />  
              </HoverCardTrigger>
              <HoverCardContent className="max-w-xs p-4 bg-customGreen/10 rounded-xl shadow-xl border border-customGreen text-darkGreen">
                  <div className="flex items-start space-x-2">
                      <Info className="h-5 w-5 text-customGreen mt-1.5" />  
                      <p className="text-sm text-darkGreen break-words overflow-hidden">
                          {descripcion}
                      </p>
                  </div>
              </HoverCardContent>
          </HoverCard>
      ) : (
          <span className="flex items-center">
              {nserie}
              <Info className="ml-2 h-4 w-4 text-gray-400" />  {/* Ícono gris si no hay descripción */}
          </span>
      );
    },    
},
    {
        accessorKey: "cliente.nombre", 
        header: ({column})=>(
          <DatatableColumnHeader title="Propietario" column={column}/>
        ),
        cell: info => `${info.row.original.cliente.nombre} ${info.row.original.cliente.apellido}`
    },
    {
        accessorKey: "tipoEquipo.nombre",
        header: ({column})=>(
          <DatatableColumnHeader title="Tipo" column={column}/>
        ),
    },
    {
        accessorKey: "marca.nombre",
        header: ({column})=>(
          <DatatableColumnHeader title="Marca" column={column}/>
        ),
    },
    {
        accessorKey: "modelo.nombre",
        header: ({column})=>(
          <DatatableColumnHeader title="Modelo" column={column}/>
        ),
    },
    {
      id: 'actions',
      header: "Acciones",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }
];