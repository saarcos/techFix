import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { ResponsiveDialogExtended } from './responsive-dialog-extended';
import { ProductCombobox } from "@/Components/comboBoxes/producto-combobox";
import { ServiceCombobox } from "@/Components/comboBoxes/servicio-combobox";
import { Input } from '@/Components/ui/input';
import { getProducts, Product } from '@/api/productsService';
import { getServices, Service } from '@/api/servicioService';
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

interface AddDetalleModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddDetalle: (detalle: { producto?: Product; servicio?: Service; cantidad?: number; precioservicio?: number; precioproducto?: number }) => void;
}

const AddDetalleModal = ({ isOpen, setIsOpen, onAddDetalle }: AddDetalleModalProps) => {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['productos'],
    queryFn: getProducts,
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: getServices,
  });

  const [selectedProduct, setSelectedProduct] = useState<{ producto: Product; cantidad: number; precio: number } | null>(null);
  const [selectedService, setSelectedService] = useState<{ servicio: Service; precio: number } | null>(null);

  const addProduct = (id_producto: number) => {
    const product = products.find((prod) => prod.id_producto === id_producto);
    if (product) {
      setSelectedProduct({ producto: product, cantidad: 1, precio: product.precioFinal });
    }
  };

  const addService = (id_servicio: number) => {
    const service = services.find((serv) => serv.id_servicio === id_servicio);
    if (service) {
      setSelectedService({ servicio: service, precio: service.preciofinal });
    }
  };

  const updateProductQuantity = (cantidad: number) => {
    if (selectedProduct) {
      setSelectedProduct({ ...selectedProduct, cantidad });
    }
  };

  const handleAddDetalles = () => {
    if (selectedProduct || selectedService) {
      onAddDetalle({
        producto: selectedProduct ? selectedProduct.producto : undefined,
        servicio: selectedService ? selectedService.servicio : undefined,
        cantidad: selectedProduct ? selectedProduct.cantidad : undefined,
        precioproducto: selectedProduct ? selectedProduct.precio : undefined,
        precioservicio: selectedService ? selectedService.precio : undefined,
      });
    }
    resetSelection();
    setIsOpen(false);
  };

  const resetSelection = () => {
    setSelectedProduct(null);
    setSelectedService(null);
  };

  const handleCancel = () => {
    resetSelection();
    setIsOpen(false);
  };

  return (
    <ResponsiveDialogExtended
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Añadir detalles a la orden"
      description="Selecciona un producto o servicio y especifica la cantidad si aplica."
    >
      {/* Productos Combobox */}
      <h3 className="mt-4 text-lg font-semibold">Productos</h3>
      <div className="mb-4">
        <ProductCombobox
          field={{ value: '', onChange: (id_producto: number) => addProduct(id_producto) }}
          products={products}
        />
      </div>
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead className="text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedProduct ? (
            <TableRow>
              <TableCell>{selectedProduct.producto.nombreProducto}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() => updateProductQuantity(Math.max(1, selectedProduct.cantidad - 1))}
                    className="h-8 w-8 bg-customGreen hover:bg-customGreenHover rounded-full text-black"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </Button>
                  <Input
                    type="number"
                    value={selectedProduct.cantidad}
                    onChange={(e) => updateProductQuantity(parseInt(e.target.value))}
                    min={1}
                    className="w-16 text-center"
                  />
                  <Button
                    type="button"
                    onClick={() => updateProductQuantity(selectedProduct.cantidad + 1)}
                    className="h-8 w-8 bg-customGreen hover:bg-customGreenHover rounded-full text-black"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedProduct(null)}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500">
                No hay producto seleccionado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Servicios Combobox */}
      <h3 className="mt-4 text-lg font-semibold">Servicios</h3>
      <div className="mb-4">
        <ServiceCombobox
          field={{ value: '', onChange: (id_servicio: number) => addService(id_servicio) }}
          services={services}
        />
      </div>
      {/* Servicios seleccionados */}
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Servicio</TableHead>
            <TableHead className="text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedService ? (
            <TableRow>
              <TableCell>{selectedService.servicio.nombre}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedService(null)}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-gray-500">
                No hay servicio seleccionado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleCancel} variant="outline">
          Cancelar
        </Button>
        <Button
          onClick={handleAddDetalles}
          className="bg-customGreen ml-2 text-black hover:bg-customGreenHover"
          disabled={!selectedProduct && !selectedService} // Deshabilitar si no hay producto o servicio seleccionado
        >
          Agregar Detalle
        </Button>
      </div>
    </ResponsiveDialogExtended>
  );
};

export default AddDetalleModal;