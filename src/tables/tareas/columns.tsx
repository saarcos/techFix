
import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";

import { Tarea } from "@/api/tareaService";


export const columns: ColumnDef<Tarea>[] = [
    {
        accessorKey: "titulo",
        header: ({column})=>(
          <DatatableColumnHeader title="Título" column={column}/>
        ),
    },
    {
        accessorKey: "tiempo", 
        header: "Tiempo",
        cell: ({row})=>(
          <p className="text-gray-500">{row.getValue("tiempo")} minutos</p>
        )
    },
    {
      accessorKey: "descripcion", 
      header:"Descripción",
      cell: ({row}) => {
        const descripcion= row.original.descripcion;
        if(!descripcion){
          return <span className="text-gray-400">Sin descripción agregada</span>;
        }
        return(
          row.getValue("descripcion")
        )
      }
      
    },
    {
      id: 'actions',
      header: "Acciones",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }
];