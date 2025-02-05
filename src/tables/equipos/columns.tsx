
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
      const nserie = row.original.nserie;
      return (
        <div className="flex items-center">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="text-darkGreen hover:text-customGreenHover flex items-center"
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                {nserie ? (
                  <>
                    <Info className="mr-2 text-darkGreen" />
                    <span className={description ? "underline" : ""}>{nserie}</span>
                  </>
                ) : (
                  <>
                    <Info className="mr-2 text-gray-500 italic" />
                    <span className={description ? "underline text-gray-500 italic" : "text-gray-500 italic"}>Sin N° de serie agregado</span>
                  </>
                )}
              </button>
            </PopoverTrigger>
            {description && (
              <PopoverContent
                className="p-4 rounded-lg shadow-lg border-s-customGray bg-customGray"
              >
                <h3 className="font-bold mb-2 text-customGreen">Descripción</h3>
                <p className="text-white font-thin">{description}</p>
              </PopoverContent>
            )}
          </Popover>
        </div>
      );
    },
  },
  {
    accessorKey: "propietario",
    header: ({ column }) => (
      <DatatableColumnHeader title="Propietario" column={column} />
    ),
    cell: info => `${info.row.original.cliente.nombre} ${info.row.original.cliente.apellido}`
  },
  {
    accessorKey: "tipoEquipo.nombre",
    header: ({ column }) => (
      <DatatableColumnHeader title="Tipo" column={column} />
    ),
  },
  {
    accessorKey: "modelo.marca.nombre",
    header: ({ column }) => (
      <DatatableColumnHeader title="Marca" column={column} />
    ),
  },
  {
    accessorKey: "modelo.nombre",
    header: ({ column }) => (
      <DatatableColumnHeader title="Modelo" column={column} />
    ),
  },
  {
    id: 'actions',
    header: "Acciones",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  }
];