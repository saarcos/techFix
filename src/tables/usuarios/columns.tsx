import {  User } from "@/api/userService";

import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";


export const columns: ColumnDef<User>[] = [
  {
        accessorKey: "nombre",
        header: ({column})=>(
          <DatatableColumnHeader title="Nombre" column={column}/>
        ),
        cell: info => `${info.row.original.nombre} ${info.row.original.apellido}`
    },
    {
        accessorKey: "rol.nombrerol", // Acceder al nombre del rol
        header: ({column})=>(
          <DatatableColumnHeader title="Rol" column={column}/>
        ),
    },
    {
        accessorKey: "email",
        header: "Correo",
        cell: ({row})=>(
          <a href={`mailto:${row.getValue("email")}`}
          className="font-medium text-blue-600 hover:underline">
            {row.getValue("email")}
          </a>
        ),
    },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }
];