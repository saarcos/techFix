
import { ColumnDef } from "@tanstack/table-core";

import DatatableColumnHeader from '@/Components/datatable-column-header'

import { DataTableRowActions } from "./data-table-row-actions";

import { Tarea } from "@/api/tareaService";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";


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
      cell: ({ row }) => {
        return (
          <div className="flex space-x-3">
          <DataTableRowActions row={row} />
          <Popover>
            {/* Cambiar el botón a un div o span */}
            <PopoverTrigger asChild>
              <span className="px-4 py-2 text-black font-semibold bg-customGreen hover:bg-customGreenHover rounded-md  cursor-pointer">
                Detalles
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 bg-white shadow-lg rounded-lg">
              <div className="text-lg font-semibold mb-2">Detalles de la Tarea</div>
              <p className="text-gray-500 mb-4 font-thin">
                Productos y servicios añadidos:
              </p>
              <div className="text-sm">
                <h4 className="font-semibold mb-1">Productos</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {row.original.productos.length > 0 ? (
                    row.original.productos.map((producto) => (
                      <li key={producto.id_producto}>
                        {producto.producto.nombreProducto} 
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">No hay productos</li>
                  )}
                </ul>
                <h4 className="font-semibold mt-4 mb-1">Servicios</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {row.original.servicios.length > 0 ? (
                    row.original.servicios.map((servicio) => (
                      <li key={servicio.id_servicio}>
                        {servicio.servicio.nombre} 
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-400">No hay servicios</li>
                  )}
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        );
      },
    }
];