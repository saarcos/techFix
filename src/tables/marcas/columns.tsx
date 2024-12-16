
import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";
import { Brand } from "@/api/marcasService";

export const columns: ColumnDef<Brand>[] = [
    
    {
        accessorKey: "nombre",
        header: ({column})=>(
          <DatatableColumnHeader title="Nombre" column={column}/>
        ),
        cell: info => `${info.row.original.nombre}`
    },
    {
      id: 'actions',
      header: "Acciones",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }
];