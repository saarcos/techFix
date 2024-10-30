import { getOrdenesTrabajo, OrdenTrabajo } from "@/api/ordenTrabajoService";
import OrderDetails from "@/Components/OrderDetails";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Progress } from "@/Components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import OrdenesTable from "@/tables/ordenesTrabajo/ordenes-table";
import { useQuery } from "@tanstack/react-query";
import { File, ListFilter } from "lucide-react";
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
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 mt-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Tus órdenes de trabajo</CardTitle>
              <CardDescription className="text-balance max-w-lg leading-relaxed">
                Administra y controla las órdenes de trabajo para los equipos ingresados al taller para darles un seguimiento preciso durante el proceso de reparación.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                className="bg-customGreen text-black hover:bg-customGreenHover"
                onClick={() => navigate('/taller/nuevaOrden')}
              >
                Crear nueva orden
              </Button>
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-1">
            <CardHeader className="pb-2">
              <CardDescription>This Week</CardDescription>
              <CardTitle className="text-4xl">$1,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +25% from last week
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={25} aria-label="25% increase" />
            </CardFooter>
          </Card>
          <Card x-chunk="dashboard-05-chunk-2">
            <CardHeader className="pb-2">
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-4xl">$5,329</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +10% from last month
              </div>
            </CardContent>
            <CardFooter>
              <Progress value={12} aria-label="12% increase" />
            </CardFooter>
          </Card>
        </div>
        <Tabs defaultValue={ordenTabs[0]}>
          <div className="flex items-center">
            <TabsList>
              <TabsList>
                {ordenTabs.map((area) => (
                  <TabsTrigger key={area} value={area}>
                    {area} ({ordenesCount[area]})
                  </TabsTrigger>
                ))}
              </TabsList>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Fulfilled
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Declined
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Refunded
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Export</span>
              </Button>
            </div>
          </div>
          {ordenTabs.map((area) => (
            <TabsContent key={area} value={area}>
              <Card x-chunk={`dashboard-05-chunk-${area}`}>
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
                    ordenes={ordenesPorArea[area] || []} // Usar el área correspondiente
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
