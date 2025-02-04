// src/components/OrdenesTable.tsx
import { Badge } from "@/Components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { OrdenTrabajo } from '@/api/ordenTrabajoService';
import { AlertTriangle } from "lucide-react";
interface OrdenesTableProps {
  ordenes: OrdenTrabajo[];
  onSelectOrder: (order: OrdenTrabajo) => void;
  selectedOrder: OrdenTrabajo | null;  // Añadir la orden seleccionada como prop
}
const OrdenesTable = ({ onSelectOrder, ordenes, selectedOrder }: OrdenesTableProps) => {
  const isNearDueDate = (fechaPrometida: string) => {
    const fechaActual = new Date();
    
    // Desglosar el string "YYYY-MM-DD" y crear una fecha local
    const [year, month, day] = fechaPrometida.split('-').map(Number);
    const fechaPrometidaDate = new Date(year, month - 1, day); // Mes empieza en 0 (enero)
  
    // Ajustar horas a medianoche
    fechaPrometidaDate.setHours(0, 0, 0, 0);
    fechaActual.setHours(0, 0, 0, 0);
  
    // Calcular diferencia en días
    const diferenciaDias = (fechaPrometidaDate.getTime() - fechaActual.getTime()) / (1000 * 3600 * 24);
  
    // Devuelve true si la fecha prometida está entre hoy y los próximos 3 días
    return diferenciaDias <= 3 && diferenciaDias >= 0;
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Equipo</TableHead>
            <TableHead className="hidden sm:table-cell">Prioridad</TableHead>
            <TableHead className="hidden md:table-cell">Fecha de entrega</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="hover:cursor-pointer">
          {ordenes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                No hubo resultados.
              </TableCell>
            </TableRow>
          ) : (
            ordenes.map((orden) => (
              <TableRow
                key={orden.id_orden}
                className={selectedOrder?.id_orden === orden.id_orden ? "bg-customGreen/10" : ""}
                onClick={() => onSelectOrder(orden)}
              >
                <TableCell>
                  <div className="font-medium">{orden.equipo.cliente.nombre} {orden.equipo.cliente.apellido}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    <a href={`mailto:${orden.equipo.cliente.correo}`} className="font-medium hover:underline">
                      {orden.equipo.cliente.correo}
                    </a>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{orden.equipo.modelo.nombre}</div>
                  {orden.equipo.nserie ? (<div className="hidden text-sm text-muted-foreground md:inline font-medium">
                    N° serie: {orden.equipo.nserie}
                  </div>) : (<div className="hidden text-sm text-muted-foreground md:inline font-medium">
                    N° serie: No disponible
                  </div>)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge
                    className={`text-xs ${orden.prioridad === "Alta"
                      ? "bg-red-500 text-white" // Color rojo para "Alta"
                      : orden.prioridad === "Normal"
                        ? "bg-[#00E599] text-black hover:bg-customGreenHover" // customGreen para "Normal"
                        : "bg-[#1E293B] text-white" // customGray para "Baja"
                      }`}
                  >
                    {orden.prioridad}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                {orden.fecha_prometida ? (
                    <>
                      <span>{new Date(`${orden.fecha_prometida}T00:00:00`).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}</span>
                      {orden.fecha_prometida && isNearDueDate(orden.fecha_prometida.toString()) && (
                        <div className="flex items-center mt-1 text-yellow-600 text-sm">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span>¡Se aproxima la fecha de entrega!</span>
                        </div>
                      )}
                    </>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {typeof orden.total === 'string' && !isNaN(parseFloat(orden.total))
                    ? `$${parseFloat(orden.total).toFixed(2)}`
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdenesTable;
