import { getOrdenesTrabajo, OrdenTrabajo } from "@/api/ordenTrabajoService"
import OrderDetails from "@/Components/OrderDetails"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { Progress } from "@/Components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import OrdenesTable from "@/tables/ordenesTrabajo/ordenes-table"
import { useQuery } from "@tanstack/react-query"
import {  File, ListFilter } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import Spinner from '../assets/tube-spinner.svg';

const Ordenes = () => {
  const navigate = useNavigate(); 
  const [selectedOrder, setSelectedOrder] = useState<OrdenTrabajo | null>(null);
  const { data: ordenes = [], isLoading, error } = useQuery<OrdenTrabajo[]>({
    queryKey: ['ordenesTrabajo'],
    queryFn: getOrdenesTrabajo,
  });

  useEffect(() => {
    if (ordenes.length > 0 && !selectedOrder) {
      setSelectedOrder(ordenes[0]); 
    }
  }, [ordenes, selectedOrder]);

  if (isLoading ) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
  if (error ) return toast.error('Error al recuperar los datos');

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 mt-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card
            className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
          >
            <CardHeader className="pb-3">
            <CardTitle>Tus órdenes de trabajo</CardTitle>
              <CardDescription className="text-balance max-w-lg leading-relaxed">
                Administra y controla las órdenes de trabajo para los equipos ingresados al taller para darles un seguimiento preciso durante el proceso de reparación.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
              className="bg-customGreen text-black hover:bg-customGreenHover"
              onClick={() => navigate('/taller/nuevaOrden')} // Redirige a /taller/nuevaOrden
              >Crear nueva orden</Button>
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
        <Tabs defaultValue="week">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="week">Entrada</TabsTrigger>
              <TabsTrigger value="month">Reparación</TabsTrigger>
              <TabsTrigger value="year">Salida</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-sm"
                  >
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
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 text-sm"
              >
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Export</span>
              </Button>
            </div>
          </div>
          <TabsContent value="week">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Órdenes de trabajo</CardTitle>
                <CardDescription>
                  Órdenes recientes del taller
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrdenesTable onSelectOrder={setSelectedOrder}  selectedOrder={selectedOrder} ordenes={ordenes} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div>
        <OrderDetails order={selectedOrder} />
      </div>
    </main>
  )
}

export default Ordenes