
import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";

import { Equipo } from "@/api/equipoService";
export const columns: ColumnDef<Equipo>[] = [
    {
        accessorKey: "nserie",
        header:"N° Serie"
    },
    {
        accessorKey: "cliente.nombre", 
        header: ({column})=>(
          <DatatableColumnHeader title="Propietario" column={column}/>
        ),
        cell: info => `${info.row.original.cliente.nombre} ${info.row.original.cliente.apellido}`
    },
    {
        accessorKey: "tipoEquipo.nombre",
        header: ({column})=>(
          <DatatableColumnHeader title="Tipo" column={column}/>
        ),
    },
    {
        accessorKey: "marca.nombre",
        header: ({column})=>(
          <DatatableColumnHeader title="Marca" column={column}/>
        ),
    },
    {
        accessorKey: "modelo.nombre",
        header: ({column})=>(
          <DatatableColumnHeader title="Modelo" column={column}/>
        ),
    },
    {
      id: 'actions',
      header: "Acciones",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }
];