
import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";

import { Equipo } from "@/api/equipoService";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";

import { Info } from "lucide-react";

export const columns: ColumnDef<Equipo>[] = [
  {
    accessorKey: "nserie",
    header: ({ column }) => (
      <DatatableColumnHeader title="N° Serie" column={column} />
    ),
    cell: ({ row }) => {
      const description = row.original.descripcion;

      return (
        <div className="flex items-center">
          {description ? (
            <Popover >
              <PopoverTrigger asChild>
                <button
                  className="text-darkGreen hover:text-customGreenHover underline flex items-center"
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                >
                  {row.original.nserie}
                  <Info className="ml-2 text-darkGreen"  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="p-4 rounded-lg shadow-lg border-s-customGray bg-customGray"
                
              >
                <h3
                  className="font-bold mb-2 text-customGreen"
                >
                  Descripción
                </h3>
                <p className="text-white font-thin">{description}</p>
              </PopoverContent>
            </Popover>
          ) : (
            <span>{row.original.nserie}</span>
          )}
        </div>
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