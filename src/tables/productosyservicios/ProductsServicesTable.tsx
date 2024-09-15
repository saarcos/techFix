import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge, Package } from "lucide-react";

const ProductServiceTableShadCN = () => {
  const [items, setItems] = useState([
    { tipo: 'Producto', descripcion: 'CABLE LDNIO LS651 1M 30W IPH', precio: 6.00, cantidad: 1, descuento: 0, iva: 0, subtotal: 6.00 }
  ]);

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2);
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
                <TableHead className="text-right">(%Desc.)</TableHead>
                <TableHead className="text-right">IVA (%)</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                    No se encontraron productos o servicios.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.tipo}</TableCell>
                    <TableCell>{item.descripcion}</TableCell>
                    <TableCell className="text-right">${item.precio.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.cantidad}</TableCell>
                    <TableCell className="text-right">{item.descuento}%</TableCell>
                    <TableCell className="text-right">{item.iva}%</TableCell>
                    <TableCell className="text-right">${item.subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <p className="font-semibold text-lg">Total: ${calculateTotal()}</p>
          </div>
          <div className="flex justify-start mt-4 gap-2">
          <Button
                type="button"
                onClick={() => {/* lógica para agregar producto */}}
                className="bg-darkGreen hover:bg-darkGreen/50 hover:text-black flex items-center space-x-2"
            >
              <Package className="w-4 h-4" />
              <span>Agregar Producto</span>
            </Button>
            <Button
                type="button"
                onClick={() => {/* lógica para agregar servicio */}}
                className="bg-darkGreen hover:bg-darkGreen/50 hover:text-black flex items-center space-x-2"
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

