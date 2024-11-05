
import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";
import { Almacen } from "@/api/almacenesService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarehouse } from "@fortawesome/free-solid-svg-icons";


export const columns: ColumnDef<Almacen>[] = [
  {
    accessorKey: "nombre",
    header: ({ column }) => (
      <DatatableColumnHeader title="Nombre" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center p-2 rounded-md ">
        <FontAwesomeIcon icon={faWarehouse} className="text-darkGreen w-5 h-5 mr-3" />
        <span className="font-semibold text-gray-700">
          {row.original.nombre}
        </span>
      </div>
    )
  },
  {
    id: 'actions',
    header: "Acciones",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  }
];