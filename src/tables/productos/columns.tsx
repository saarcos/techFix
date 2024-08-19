
import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";
import { Product } from "@/api/productsService";


export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "nombreProducto",
        header: ({column})=>(
          <DatatableColumnHeader title="Nombre" column={column}/>
        ),
    },
    {
        accessorKey: "categoriaProducto.nombreCat", 
        header: ({column})=>(
          <DatatableColumnHeader title="Categoría" column={column}/>
        ),
    },
    {
      accessorKey: "codigoProducto",
      header: ({column})=>(
        <DatatableColumnHeader title="Código" column={column}/>
      ),
    },
    {
        accessorKey: "precioFinal",
        header: "Precio",
        cell: ({row})=>(
          <span 
          className="font-medium text-customGray">
            ${row.getValue("precioFinal")}
          </span>
        ),
    },
    {
      id: 'actions',
      header: "Acciones",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }
];