
import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";

import { Service } from "@/api/servicioService";

export const columns: ColumnDef<Service>[] = [

    {
        accessorKey: "nombre",
        header: ({column})=>(
          <DatatableColumnHeader title="Nombre" column={column}/>
        )
    },
    {
      accessorKey: "precio",
      header: "Precio",
      cell: ({row})=>(
        <span 
        className="font-medium text-customGray">
          ${row.getValue("precio")}
        </span>
      ),
  },
    {
        accessorKey: "categoriaServicio.nombreCat",
        header: ({column})=>(
          <DatatableColumnHeader title="Categoría" column={column}/>
        ),
        
    },

    {
      id: 'actions',
      header: "Acciones",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }
];