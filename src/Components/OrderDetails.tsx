import * as React from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Separator } from "@/Components/ui/separator";
import { Copy, Download, MoreVertical } from "lucide-react";
import { OrdenTrabajo } from "@/api/ordenTrabajoService";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/Components/ui/carousel";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer"; // Para generar manualmente el PDF
import OrderPDF from "./OrderPDF";
import { saveAs } from "file-saver";
import { CustomToast } from "./CustomToast";

interface OrderDetailsProps {
  order: OrdenTrabajo | null;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  const navigate = useNavigate(); // Definir el hook useNavigate
  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);

  const handleEditClick = () => {
    if (order) {
      navigate(`/taller/ordenes/${order.id_orden}/edit`);
    }
  };
  const handleGeneratePDF = async () => {
    if (!order) return;
    setIsGeneratingPDF(true);
    try {
      // Generar el PDF como blob
      const blob = await pdf(<OrderPDF order={order} />).toBlob();
      saveAs(blob, `orden-trabajo-${order.id_orden}.pdf`);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  return (
    <Card className="overflow-x-hidden max-w-screen-lg mx-auto" x-chunk="dashboard-05-chunk-4">
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
            Fecha creación:{" "}
            {order
              ? new Date(order.created_at + "T00:00:00Z").toLocaleDateString("es-ES", {
                timeZone: "UTC",
              })
              : "N/A"}
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button
            onClick={handleGeneratePDF}
            disabled={(order?.area !== "Salida")}
            size="sm"
            variant="outline"
            className={`h-7 gap-1 text-sm ${
              order?.area !== "Salida"
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}            >
            <Download className="h-3.5 w-3.5" />{isGeneratingPDF ? "Generando..." : "Descargar PDF"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">Más</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  if (order) {
                    handleEditClick(); // Llamar la función
                  } else {
                    CustomToast({
                      message:
                        "Por favor, selecciona una orden de trabajo primero.",
                      type: "warning",
                    });
                  }
                }}
                className="cursor-pointer">
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Descartar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 text-sm">
        {order && order.imagenes && order.imagenes.length > 0 && (
          <div className="mb-4">
            <div className="font-semibold mb-2">Imágenes de la orden</div>
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
              <div className="font-semibold">Descripción del trabajo</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {order.descripcion}
                  </span>
                </li>
                <span><span className="font-semibold">Área:</span> {order.area}</span>
              </ul>
              <Separator className="my-2" />
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                {/* Información del cliente */}
                <div className="rounded-md py-3 flex-1">
                  <h2 className="font-semibold text-md mb-2">Información del cliente</h2>
                  <address className="grid gap-1 not-italic text-muted-foreground">
                    <span>{order.equipo.cliente.nombre} {order.equipo.cliente.apellido}</span>
                    <span>{order.equipo.cliente.correo}</span>
                    <span>{order.equipo.cliente.celular}</span>
                  </address>
                </div>

                {/* Información del equipo */}
                <div className="rounded-md py-3 flex-1">
                  <h2 className="font-semibold text-md mb-2">Información del equipo</h2>
                  <ul className="grid gap-1 text-muted-foreground">
                    <li>{order.equipo.nserie}</li>
                    <li>{order.equipo.modelo.nombre}</li>
                    <li>{order.equipo.modelo.marca.nombre}</li>
                  </ul>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-4">
                {/* Título */}
                <div className="font-semibold text-lg">Detalles de la orden</div>

                {/* Renderizado condicional para detalles */}
                {order.detalles.length > 0 ? (
                  <ul className="grid gap-2 rounded-md">
                    {order.detalles.map((detalle, index) => (
                      <li
                        key={index}
                        className="flex flex-col border-b last:border-b-0 pb-2 last:pb-0"
                      >
                        {/* Mostrar servicio si está presente */}
                        {detalle.servicio && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {detalle.servicio.nombre}
                            </span>
                            <span className="font-medium text-primary">
                              ${detalle.precioservicio}
                            </span>
                          </div>
                        )}

                        {/* Mostrar producto si está presente */}
                        {detalle.producto && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {detalle.producto.nombreProducto}{" "}
                              <span className="text-muted-foreground">(x{detalle.cantidad})</span>
                            </span>
                            <span className="font-medium text-primary">
                              ${detalle.precioproducto}
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bg-muted/10 rounded-md text-center text-sm text-muted-foreground p-3">
                    Aún no se han agregado detalles a la orden.
                  </div>
                )}

                {/* Presupuesto, adelanto y total */}
                <div className="bg-muted/10 rounded-md">
                  <dl className="grid gap-2">
                    {order.presupuesto && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Presupuesto:</dt>
                        <dd className="font-medium text-primary">
                          ${order.presupuesto}
                        </dd>
                      </div>
                    )}
                    {order.adelanto && (
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Adelanto:</dt>
                        <dd className="font-medium text-primary">
                          ${order.adelanto}
                        </dd>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <dt className="text-muted-foreground">Total:</dt>
                      <dd className="font-bold text-success">
                        ${order.total}
                      </dd>
                    </div>
                  </dl>
                </div>
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

      </CardFooter>
    </Card>
  );
};

export default OrderDetails;
