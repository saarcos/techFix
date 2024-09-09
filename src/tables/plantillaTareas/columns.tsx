
import { ColumnDef } from "@tanstack/table-core";

// import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";
import { Plantilla } from "@/api/plantillaService";
import { Badge } from "@/Components/ui/badge";


export const columns: ColumnDef<Plantilla>[] = [
    {
        accessorKey: "descripcion",
        header: "Descripción"
    },
    {
      accessorKey: "tareas",
      header: "Tareas",
      cell: ({ row }) => {
        const tareas = row.original.tareas; // Acceder a las tareas dentro de la plantilla
        if (tareas.length === 0) {
          return <span className="text-gray-400">Sin tareas agregadas</span>;
        }
        return (
          <div className="space-y-2 max-w-sm"> {/* Limitar el ancho máximo */}
            {tareas.map((tareaObj, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="block text-xs p-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-center">
                {tareaObj.tarea.titulo}
              </Badge>
            ))}
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: "Acciones",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    }
];