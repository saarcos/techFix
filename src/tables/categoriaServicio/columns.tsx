
import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";
import { ServiceCategory } from "@/api/serviceCategories";


export const columns: ColumnDef<ServiceCategory>[] = [
    {
      accessorKey: "nombreCat", 
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