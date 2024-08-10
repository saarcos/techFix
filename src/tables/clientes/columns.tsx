import {  Client } from "@/api/clientService";

import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip"
import { faBuilding, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "tipo_cliente",
      header: "",
      cell: ({ row }) => (
        <FontAwesomeIcon icon={row.original.tipo_cliente === "Empresa" ? faBuilding : faUser}  className="text-customGray w-4 h-4"/>
      ),
    },
    {
        accessorKey: "nombre",
        header: ({column})=>(
          <DatatableColumnHeader title="Nombre" column={column}/>
        ),
        cell: info => `${info.row.original.nombre} ${info.row.original.apellido}`
    },
    {
        accessorKey: "cedula", 
        header: ({column})=>(
          <DatatableColumnHeader title="Cedula" column={column}/>
        ),
    },
    {
        accessorKey: "correo",
        header: "Correo",
        cell: ({row})=>(
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
              <a href={`mailto:${row.getValue("correo")}`}
              className="font-medium text-blue-600 hover:underline">
                {row.getValue("correo")}
              </a>
              </TooltipTrigger>
              <TooltipContent className="bg-customGray text-white">
                <p>Enviar un correo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
    },
    {
      accessorKey: "celular", 
      header:"Celular"
    },
    {
      id: 'actions',
      header: "Acciones",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }
];