// src/components/OrdenesTable.tsx
import { Badge } from "@/Components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { OrdenTrabajo } from '@/api/ordenTrabajoService';
interface OrdenesTableProps {
  ordenes: OrdenTrabajo[];
  onSelectOrder: (order: OrdenTrabajo) => void;
  selectedOrder: OrdenTrabajo | null;  // Añadir la orden seleccionada como prop
}
const OrdenesTable = ({ onSelectOrder, ordenes, selectedOrder }: OrdenesTableProps) => {

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
                  <div className="hidden text-sm text-muted-foreground md:inline font-medium">
                    N° serie: {orden.equipo.nserie}
                  </div>
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
