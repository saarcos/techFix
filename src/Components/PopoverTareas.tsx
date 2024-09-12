import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/Components/ui/popover";
  
  export default function PopoverTareas() {
    return (
      <div className="relative">
        <Popover>
          <PopoverTrigger>
            <button className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500">
              Ver Detalles
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 bg-white shadow-lg rounded-lg">
            <div className="text-lg font-semibold mb-2">Detalles de la Tarea</div>
            <p className="text-gray-500 mb-4">
              Aquí puedes ver los detalles de productos y servicios.
            </p>
            <div className="text-sm">
              <h4 className="font-semibold mb-1">Productos</h4>
              <ul className="list-disc list-inside text-gray-700">
                <li>Producto 1 - Cantidad: 2</li>
                <li>Producto 2 - Cantidad: 5</li>
              </ul>
              <h4 className="font-semibold mt-4 mb-1">Servicios</h4>
              <ul className="list-disc list-inside text-gray-700">
                <li>Servicio 1 - Precio: $50</li>
                <li>Servicio 2 - Precio: $100</li>
              </ul>
            </div>
            <button className="mt-4 w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-500">
              Ver Más
            </button>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
  