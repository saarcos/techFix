
import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";
import { Model } from "@/api/modeloService";

export const columns: ColumnDef<Model>[] = [
    
    {
        accessorKey: "nombre",
        header: ({column})=>(
          <DatatableColumnHeader title="Nombre" column={column}/>
        ),
        cell: info => `${info.row.original.nombre}`
    },
    {
        accessorKey: "marca",
        header: ({column})=>(
          <DatatableColumnHeader title="Marca" column={column}/>
        ),
        cell: info => `${info.row.original.marca.nombre}`
    },
    {
      id: 'actions',
      header: "Acciones",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }
];