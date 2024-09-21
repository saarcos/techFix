import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge, Package } from "lucide-react";
import { ProductoOrden, ServicioOrden } from "@/api/ordenTrabajoService";

interface ProductServiceTableProps {
  productos: ProductoOrden[]; // Recibe los productos como prop
  servicios: ServicioOrden[]; // Recibe los servicios como prop
}

const ProductServiceTableShadCN = ({ productos, servicios }: ProductServiceTableProps) => {
  const [items, setItems] = useState<ProductoOrden[]>(productos || []);
  const [serviceItems, setServiceItems] = useState<ServicioOrden[]>(servicios || []);

  useEffect(() => {
    // Actualiza los items cuando los productos cambian
    setItems(productos);
  }, [productos]);

  useEffect(() => {
    // Actualiza los items cuando los servicios cambian
    setServiceItems(servicios);
  }, [servicios]);

  const calculateSubtotal = (item: ProductoOrden | ServicioOrden) => {
    if ('producto' in item) {
      return (item.producto.precioFinal * item.cantidad).toFixed(2);
    } else {
      return (item.servicio.precio * 1).toFixed(2);
    }
  };

  const calculateTotal = () => {
    const productTotal = items.reduce((acc, item) => acc + parseFloat(calculateSubtotal(item)), 0);
    const serviceTotal = serviceItems.reduce((acc, item) => acc + parseFloat(calculateSubtotal(item)), 0);
    return (productTotal + serviceTotal).toFixed(2);
  };

  return (
    <div className="mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-sans">Productos y Servicios</CardTitle>
          <CardDescription>Añade productos y servicios a la orden de trabajo</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">P. Unitario</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">IVA (%)</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 && serviceItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                    No se encontraron productos o servicios.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {items.map((item) => (
                    <TableRow key={item.id_producto}>
                      <TableCell>Producto</TableCell>
                      <TableCell>{item.producto.nombreProducto}</TableCell>
                      <TableCell className="text-right">${item.producto.precioSinIVA}</TableCell>
                      <TableCell className="text-right">{item.cantidad}</TableCell>
                      <TableCell className="text-right">{item.producto.iva}%</TableCell>
                      <TableCell className="text-right">${calculateSubtotal(item)}</TableCell>
                    </TableRow>
                  ))}
                  {serviceItems.map((item) => (
                    <TableRow key={item.id_servicio}>
                      <TableCell>Servicio</TableCell>
                      <TableCell>{item.servicio.nombre}</TableCell>
                      <TableCell className="text-right">${item.servicio.precio}</TableCell>
                      <TableCell className="text-right">1</TableCell>
                      <TableCell className="text-right">0%</TableCell>
                      <TableCell className="text-right">${calculateSubtotal(item)}</TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <p className="font-semibold text-lg">Total: ${calculateTotal()}</p>
          </div>
          <div className="flex justify-start mt-4 gap-2 flex-wrap">
            <Button
              type="button"
              onClick={() => {/* lógica para agregar producto */ }}
              className="bg-darkGreen hover:bg-darkGreen/50 hover:text-black flex items-center space-x-2 px-4 py-2 text-sm sm:px-6 sm:text-base rounded-md w-full sm:w-auto"
            >
              <Package className="w-4 h-4" />
              <span>Agregar Producto</span>
            </Button>
            <Button
              type="button"
              onClick={() => {/* lógica para agregar servicio */ }}
              className="bg-darkGreen hover:bg-darkGreen/50 hover:text-black flex items-center space-x-2 px-4 py-2 text-sm sm:px-6 sm:text-base rounded-md w-full sm:w-auto"
            >
              <Badge className="w-4 h-4" />
              <span>Agregar Servicio</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductServiceTableShadCN;
