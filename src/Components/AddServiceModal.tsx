import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { ResponsiveDialogExtended } from './responsive-dialog-extended';
import { Input } from '@/Components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { getServices, Service } from '@/api/servicioService';

interface AddServiceModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddService: (servicio: Service) => void; // Solo se pasa el id del servicios y la cantidad
}

const AddServiceModal = ({ isOpen, setIsOpen, onAddService }: AddServiceModalProps) => {
  // Traer productos desde la base de datos
  const { data: servicios = [] } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: getServices, // Asumiendo que `getServices` hace una solicitud a la API para obtener los servicios
  });

  return (
    <ResponsiveDialogExtended
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Seleccionar Servicio"
      description="Selecciona servicios para añadir a la orden de trabajo."
    >
      {/* Buscador */}
      <div className="mb-4">
        <Input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Buscador"
          // Puedes añadir funcionalidad para filtrar productos aquí si lo necesitas
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicios.map((servicio) => (
            <TableRow key={servicio.id_servicio}>
              <TableCell>{servicio.nombre}</TableCell>
              <TableCell>${servicio.preciofinal}</TableCell>              
              <TableCell>
                <Button
                  className="bg-customGreen hover:bg-customGreenHover"
                  onClick={() => onAddService(servicio)}
                >
                  Agregar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => setIsOpen(false)} variant="outline">
          Cancelar
        </Button>
      </div>
    </ResponsiveDialogExtended>
  );
};

export default AddServiceModal;
