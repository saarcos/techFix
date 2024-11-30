import { getOrdenesTrabajo, OrdenTrabajo } from "@/api/ordenTrabajoService";
import OrderDetails from "@/Components/OrderDetails";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import OrdenesTable from "@/tables/ordenesTrabajo/ordenes-table";
import { useQuery } from "@tanstack/react-query";
import { ListFilter } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Spinner from '../assets/tube-spinner.svg';

// Define el tipo para el estado de las órdenes
interface OrdenesPorArea {
  [key: string]: OrdenTrabajo[];
}
interface OrdenesProps {
  ordenesProp?: OrdenTrabajo[];
}

const Ordenes = ({ ordenesProp }: OrdenesProps) => {
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<OrdenTrabajo | null>(null);
  const { data: ordenes = [], isLoading, error } = useQuery<OrdenTrabajo[]>({
    queryKey: ['ordenesTrabajo'],
    queryFn: getOrdenesTrabajo,
    enabled: !ordenesProp,
  });

  // Usar las órdenes de `ordenesProp` si están definidas, de lo contrario usar las de la consulta `getOrdenesTrabajo`
  const ordenesData = ordenesProp || ordenes;

  // Si está cargando, muestra el spinner
  if (isLoading && !ordenesProp) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;

  // Si hay un error, muestra un mensaje
  if (error) return toast.error('Error al recuperar los datos');

  // Organizar las órdenes por área
  const ordenesPorArea: OrdenesPorArea = ordenesData.reduce((acc: OrdenesPorArea, orden: OrdenTrabajo) => {
    const area = orden.area || 'Sin Asignar'; // Asignar un valor por defecto si no hay área
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(orden);
    return acc;
  }, {});

  // Definir el orden de las tabs
  const ordenTabs = ['Entrada', 'Reparación', 'Salida'];
  type Area = typeof ordenTabs[number]; // Crea un tipo literal basado en el array
  // Conteo de órdenes por área 
  const ordenesCount: Record<Area, number> = {
    Entrada: ordenesPorArea['Entrada']?.length || 0,
    Reparación: ordenesPorArea['Reparación']?.length || 0,
    Salida: ordenesPorArea['Salida']?.length || 0,
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-3 overflow-x-hidden max-w-full">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Tabs defaultValue={ordenTabs[0]} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        <TabsList className="flex flex-wrap gap-2">
              {ordenTabs.map((area) => (
                <TabsTrigger
                  key={area}
                  value={area}
                  className="text-xs sm:text-sm py-1 px-2 whitespace-nowrap"
                >
                  {area} ({ordenesCount[area]})
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate("/taller/nuevaOrden")}
                className="h-7 gap-1 text-sm sm:h-8 bg-customGreen text-black hover:bg-customGreenHover">
                Nueva orden
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 sm:h-8 gap-1 text-sm flex items-center"
                  >
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Filtrar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Cumplidas
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Rechazadas
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Reembolsadas
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {ordenTabs.map((area) => (
            <TabsContent key={area} value={area}>
              <Card>
                <CardHeader className="px-7">
                  <CardTitle>Órdenes de trabajo - {area}</CardTitle>
                  <CardDescription>
                    Órdenes recientes del taller en {area}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrdenesTable
                    onSelectOrder={setSelectedOrder}
                    selectedOrder={selectedOrder}
                    ordenes={ordenesPorArea[area] || []}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <div>
        <OrderDetails order={selectedOrder} />
      </div>
    </main>
  );
};

export default Ordenes;
