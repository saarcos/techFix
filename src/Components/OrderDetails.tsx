import * as React from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem } from "@/Components/ui/pagination";
import { Separator } from "@/Components/ui/separator";
import { ChevronLeft, ChevronRight, Copy, CreditCard, MoreVertical, Truck } from "lucide-react";
import { OrdenTrabajo } from "@/api/ordenTrabajoService";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/Components/ui/carousel";
import { useNavigate } from "react-router-dom";

interface OrderDetailsProps {
  order: OrdenTrabajo | null;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const navigate = useNavigate(); // Definir el hook useNavigate

  const handleEditClick = () => {
    if (order) {
      navigate(`${order.id_orden}/edit`); // Redirigir al formulario de edición
    }
  };
  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            N° {order ? order.numero_orden : "N/A"}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copiar número de orden</span>
            </Button>
          </CardTitle>
          <CardDescription>
            Fecha creación: {order ? new Date(order.created_at).toLocaleDateString() : "N/A"}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <Truck className="h-3.5 w-3.5" />
            <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
              Track Order
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEditClick} className="cursor-pointer">Edit</DropdownMenuItem>
            <DropdownMenuItem>Export</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Trash</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        {order && order.imagenes && order.imagenes.length > 0 && (
           <div className="mb-4">
           <div className="font-semibold mb-2">Order Images</div>
           <div className="relative w-full mx-auto max-w-md"> {/* Ajusta el ancho máximo */}
             <Carousel className="w-full h-full">
               <CarouselContent>
                 {order.imagenes.map((imagen, index) => (
                   <CarouselItem key={index}>
                     <div className="flex items-center justify-center p-1">
                       <Card className="overflow-hidden">
                         <CardContent className="flex items-center justify-center p-2">
                           <img
                             src={imagen.url_imagen}
                             alt={`Imagen ${index + 1}`}
                             className="max-w-full max-h-[300px] object-contain" // Ajusta la altura máxima
                             style={{ height: "auto", width: "auto" }} // Mantén la proporción
                           />
                         </CardContent>
                       </Card>
                     </div>
                   </CarouselItem>
                 ))}
               </CarouselContent>
               <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8" />
               <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8" />
             </Carousel>
           </div>
         </div>
        )}
        {order ? (
          <>
            <div className="grid gap-3">
              <div className="font-semibold">Order Details</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {order.descripcion}
                  </span>
                  <span>${order.total}</span>
                </li>
              </ul>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <div className="font-semibold">Shipping Information</div>
                  <address className="grid gap-0.5 not-italic text-muted-foreground">
                    <span>{order.cliente.nombre} {order.cliente.apellido}</span>
                    <span>{order.cliente.correo}</span>
                    <span>{order.cliente.celular}</span>
                  </address>
                </div>
                <div className="grid auto-rows-max gap-3">
                  <div className="font-semibold">Billing Information</div>
                  <div className="text-muted-foreground">
                    Same as shipping address
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Payment Information</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-1 text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      Visa
                    </dt>
                    <dd>**** **** **** 4532</dd>
                  </div>
                </dl>
              </div>
            </div>
          </>
        ) : (
          <p>Ninguna orden seleccionada, por favor haz clic en alguna</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Fecha prometida: {" "}
          <time dateTime={order?.fecha_prometida ? new Date(order.fecha_prometida).toISOString() : ""}>
            {order?.fecha_prometida
              ? new Date(`${order.fecha_prometida}T00:00:00`).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })
              : "N/A"}
          </time>
        </div>
        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous Order</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next Order</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
};

export default OrderDetails;
