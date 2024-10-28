import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge, Package, X } from "lucide-react";
import { ProductoOrden, ServicioOrden } from "@/api/ordenTrabajoService";
import AddProductModal from "@/Components/AddProductModal";
import { Product } from "@/api/productsService";
import { Service } from "@/api/servicioService";
import AddServiceModal from "@/Components/AddServiceModal";

interface ProductServiceTableProps {
  productos: ProductoOrden[]; // Recibe los productos como prop
  servicios: ServicioOrden[]; // Recibe los servicios como prop
  ordenId: number;
  onProductosChange: (productos: ProductoOrden[]) => void; // Callback para productos
  onServiciosChange: (servicios: ServicioOrden[]) => void;  // Callback para servicios
  onTotalChange: (total: number) => void;
  adelanto?: number; // Adelanto opcional
}

const ProductServiceTableShadCN = ({ productos, servicios, ordenId, onProductosChange, onServiciosChange, onTotalChange, adelanto }: ProductServiceTableProps) => {
  const [items, setItems] = useState<ProductoOrden[]>(productos || []);
  const [serviceItems, setServiceItems] = useState<ServicioOrden[]>(servicios || []);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const handleAddProduct = (product: Product, cantidad: number) => {
    // Busca si el producto ya está en la lista
    const existingProductIndex = items.findIndex(item => item.id_producto === product.id_producto);

    if (existingProductIndex !== -1) {
      // Si el producto ya existe, actualiza su cantidad
      setItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[existingProductIndex].cantidad += cantidad; // Aumenta la cantidad
        onProductosChange(updatedItems);
        return updatedItems;
      });
    } else {
      // Si no existe, agrega el nuevo producto
      const newProductoOrden: ProductoOrden = {
        id_prodorde: Date.now(),
        id_producto: product.id_producto,
        id_orden: ordenId,
        cantidad: cantidad,
        producto: {
          nombreProducto: product.nombreProducto,
          precioFinal: product.precioFinal,
          iva: product.iva,
          precioSinIVA: product.precioSinIVA,
        },
      };

      const updatedProductos = [...items, newProductoOrden];
      setItems(updatedProductos);
      onProductosChange(updatedProductos);
    }

    // Cierra el modal después de agregar o actualizar
    setIsProductModalOpen(false);
  };

  const handleAddService = (service: Service) => {
    // Busca si el servicio ya está en la lista
    const existingServiceIndex = servicios.findIndex(item => item.id_servicio === service.id_servicio);

    if (existingServiceIndex !== -1) {
      // Si el servicio ya existe, no lo añade y simplemente cierra el modal
      setIsServiceModalOpen(false);
      return; // Sale de la función sin añadir el servicio
    }

    // Si no existe, lo añade a la lista
    const newServicioOrden: ServicioOrden = {
      id_servorden: Date.now(),
      id_servicio: service.id_servicio,
      id_orden: ordenId,
      servicio: {
        nombre: service.nombre,
        preciofinal: service.preciofinal,
        iva: service.iva,
        preciosiniva: service.preciosiniva
      },
    };

    const updatedServicios = [...servicios, newServicioOrden];
    setServiceItems(updatedServicios);
    onServiciosChange(updatedServicios);
    setIsServiceModalOpen(false);
  };

  const calculateSubtotal = (item: ProductoOrden | ServicioOrden) => {
    if ('producto' in item) {
      return (item.producto.precioFinal * item.cantidad).toFixed(2);
    } else {
      return (item.servicio.preciofinal * 1).toFixed(2);
    }
  };

  const calculateTotal = () => {
    const productTotal = items.reduce((acc, item) => acc + parseFloat(calculateSubtotal(item)), 0);
    const serviceTotal = serviceItems.reduce((acc, item) => acc + parseFloat(calculateSubtotal(item)), 0);

    let totalCalculado = productTotal + serviceTotal;
    let mensajeAdelanto = ""; // Variable para el mensaje del adelanto

    // Restar el adelanto si existe y es menor que el total
    if (adelanto && totalCalculado > adelanto) {
      totalCalculado -= adelanto;
      mensajeAdelanto = ` (Con el adelanto de $${adelanto} falta por cobrar $${totalCalculado.toFixed(2)}) `; // Mensaje que muestra que el adelanto fue restado
    }
    else if(adelanto &&  totalCalculado>0 && totalCalculado < adelanto){
      mensajeAdelanto = `¡El adelanto excede el total calculado!`
    }

    // Pasar el total calculado al componente padre
    onTotalChange(parseFloat((productTotal + serviceTotal).toFixed(2)));
    return { total: (productTotal + serviceTotal).toFixed(2), mensajeAdelanto };
  };
  // Función para eliminar un producto por id_producto
  const handleRemoveProduct = (id_producto: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id_producto !== id_producto));
    onProductosChange(items.filter((item) => item.id_producto !== id_producto)); // Notificar al componente principal
  };

  // Función para eliminar un servicio por id_servicio
  const handleRemoveService = (id_servicio: number) => {
    setServiceItems((prevServices) => prevServices.filter((item) => item.id_servicio !== id_servicio));
    onServiciosChange(serviceItems.filter((item) => item.id_servicio !== id_servicio)); // Notificar al componente principal
  };

  useEffect(() => {
    setItems(productos);
  }, [productos]);

  useEffect(() => {
    setServiceItems(servicios);
  }, [servicios]);

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
                <TableHead className="text-right hidden sm:table-cell">P. Unitario</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right hidden sm:table-cell">IVA (%)</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
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
                      <TableCell className="text-right hidden sm:table-cell">${item.producto.precioSinIVA}</TableCell>
                      <TableCell className="text-right">{item.cantidad}</TableCell>
                      <TableCell className="text-right hidden sm:table-cell">{item.producto.iva}%</TableCell>
                      <TableCell className="text-right">${calculateSubtotal(item)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProduct(item.id_producto)}>
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {serviceItems.map((item) => (
                    <TableRow key={item.id_servicio}>
                      <TableCell>Servicio</TableCell>
                      <TableCell>{item.servicio.nombre}</TableCell>
                      <TableCell className="text-right hidden sm:table-cell">${item.servicio.preciosiniva}</TableCell>
                      <TableCell className="text-right">1</TableCell>
                      <TableCell className="text-right hidden sm:table-cell">{item.servicio.iva}%</TableCell>
                      <TableCell className="text-right">${calculateSubtotal(item)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveService(item.id_servicio)}>
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
          <div className="flex flex-col items-end mt-4">
            {/* Mostrar el total en grande */}
            <p className="font-semibold text-lg">Total: ${calculateTotal().total}</p>
            {/* Mostrar el mensaje de adelanto debajo, si existe */}
            {calculateTotal().mensajeAdelanto && (
              <p className="text-sm text-muted-foreground mt-1">{calculateTotal().mensajeAdelanto}</p>
            )}
          </div>
          <div className="flex justify-start mt-4 gap-2 flex-wrap">
            <Button
              type="button"
              onClick={() => setIsProductModalOpen(true)}
              className="bg-darkGreen hover:bg-darkGreen/50 text-white flex items-center space-x-2 px-4 py-2 text-sm sm:px-6 sm:text-base rounded-md w-full sm:w-auto"
            >
              <Package className="w-4 h-4" />
              <span>Agregar Producto</span>
            </Button>
            <Button
              type="button"
              onClick={() => setIsServiceModalOpen(true)}
              className="bg-darkGreen hover:bg-darkGreen/50 text-white flex items-center space-x-2 px-4 py-2 text-sm sm:px-6 sm:text-base rounded-md w-full sm:w-auto"
            >
              <Badge className="w-4 h-4" />
              <span>Agregar Servicio</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      <AddProductModal
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
        onAddProduct={handleAddProduct}
      />
      <AddServiceModal
        isOpen={isServiceModalOpen}
        setIsOpen={setIsServiceModalOpen}
        onAddService={handleAddService}
      />
    </div>
  );
};

export default ProductServiceTableShadCN;
