import { useEffect, useState } from "react";
import { getOrdenesTrabajo, OrdenTrabajo } from "@/api/ordenTrabajoService";
import OrderDetails from "@/Components/OrderDetails";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import OrdenesTable from "@/tables/ordenesTrabajo/ordenes-table";
import { useQuery } from "@tanstack/react-query";
import { ListFilter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Spinner from "../assets/tube-spinner.svg";
import { Input } from "@/Components/ui/input";

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
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]); // Estado para el filtro de prioridad
  const [selectedTab, setSelectedTab] = useState<string>(""); // Estado para la pestaña seleccionada
  const [filtrarVencidas, setFiltrarVencidas] = useState(false);

  const { data: ordenes = [], isLoading, error } = useQuery<OrdenTrabajo[]>({
    queryKey: ["ordenesTrabajo"],
    queryFn: getOrdenesTrabajo,
    enabled: !ordenesProp,
  });

  const ordenesData = ordenesProp || ordenes;
  // Organizar las órdenes por área, aplicando filtro por término de búsqueda
  const filteredOrdenesPorArea: OrdenesPorArea = ordenesData.reduce((acc: OrdenesPorArea, orden: OrdenTrabajo) => {
    const area = orden.area || "Sin Asignar";
    const searchMatch = orden.equipo.cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    if (searchTerm && !searchMatch) return acc; // Filtrar si el término no coincide

    // Filtrar por prioridad
    if (priorityFilter.length > 0 && !priorityFilter.includes(orden.prioridad)) return acc;

    // Filtrar órdenes por vencer
    if (filtrarVencidas) {
      const today = new Date();

      // Si fecha_prometida es null, excluimos la orden
      if (!orden.fecha_prometida) return acc;

      // Desglosar el string "YYYY-MM-DD" y crear una fecha local
      const [year, month, day] = orden.fecha_prometida.toString().split('-').map(Number);
      const fechaPrometidaDate = new Date(year, month - 1, day); // Mes empieza en 0 (enero)

      // Ajustar horas a medianoche
      fechaPrometidaDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      // Calcular diferencia en días
      const daysUntilDue = (fechaPrometidaDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      // Incluir solo órdenes que vencen en los próximos 7 días
      if (daysUntilDue >= 3 || daysUntilDue <= 0) return acc;
    }
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(orden);
    return acc;
  }, {});

  // Definir el orden de las tabs
  const ordenTabs = ["Entrada", "Reparación", "Salida"];
  type Area = typeof ordenTabs[number];
  // Conteo de órdenes por área
  const ordenesCount: Record<Area, number> = {
    Entrada: filteredOrdenesPorArea["Entrada"]?.length || 0,
    Reparación: filteredOrdenesPorArea["Reparación"]?.length || 0,
    Salida: filteredOrdenesPorArea["Salida"]?.length || 0,
  };
  // Si hay "ordenesProp", seleccionamos el área de la primera orden que se encuentre
  useEffect(() => {
    if (ordenesProp && ordenesProp.length > 0) {
      const firstOrder = ordenesProp[0];
      setSelectedTab(firstOrder.area || "Entrada"); // Si el área de la primera orden está definida, la usamos
    } else {
      setSelectedTab("Entrada"); // Por defecto seleccionamos "Entrada" si no hay ordenesProp
    }
  }, [ordenesProp]);
  // Manejar cambios en el filtro de prioridad
  const togglePriority = (priority: string) => {
    setPriorityFilter((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };
  // Si está cargando, muestra el spinner
  if (isLoading && !ordenesProp) {
    return (
      <div className="flex justify-center items-center h-28">
        <img src={Spinner} className="w-16 h-16" />
      </div>
    );
  }

  // Si hay un error, muestra un mensaje
  if (error) return toast.error("Error al recuperar los datos");

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-3 overflow-x-hidden max-w-full">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
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
                className="h-7 gap-1 text-sm sm:h-8 bg-customGreen text-black hover:bg-customGreenHover"
              >
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
                  <DropdownMenuLabel>Filtrar por prioridad</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {['Alta', 'Normal', 'Baja'].map((priority) => (
                    <DropdownMenuCheckboxItem
                      className="cursor-pointer"
                      key={priority}
                      checked={priorityFilter.includes(priority)}
                      onCheckedChange={() => togglePriority(priority)}
                    >
                      {priority}
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filtrar por vencimiento</DropdownMenuLabel>

                  <DropdownMenuCheckboxItem
                    className="cursor-pointer"
                    checked={filtrarVencidas}
                    onCheckedChange={()=>setFiltrarVencidas(!filtrarVencidas)}
                  >
                    Por vencer
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
                  <CardDescription>Órdenes recientes del taller en {area}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 p-2 shadow-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:outline-none text-sm"
                      placeholder="Buscar por propietario"
                    />
                  </div>
                  <OrdenesTable
                    onSelectOrder={setSelectedOrder}
                    selectedOrder={selectedOrder}
                    ordenes={filteredOrdenesPorArea[area] || []}
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
