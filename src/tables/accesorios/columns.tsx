
import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";

import { Accesorio } from "@/api/accesorioService";

export const columns: ColumnDef<Accesorio>[] = [
    {
        accessorKey: "nombre", 
        header: ({column})=>(
          <DatatableColumnHeader title="Nombre" column={column}/>
        ),
    },
    {
      id: 'actions',
      header: "Acciones",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }
];