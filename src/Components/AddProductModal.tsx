import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { ResponsiveDialogExtended } from './responsive-dialog-extended';
import { Input } from '@/Components/ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getProducts, Product } from '@/api/productsService'; // Asumiendo que esta función existe
import { useQuery } from '@tanstack/react-query';

interface AddProductModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAddProduct: (producto: Product, cantidad: number) => void; // Solo se pasa el id del producto y la cantidad
}

const AddProductModal = ({ isOpen, setIsOpen, onAddProduct }: AddProductModalProps) => {
  // Traer productos desde la base de datos
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts, // Asumiendo que `getProducts` hace una solicitud a la API para obtener los productos
  });

  // Estado local para manejar las cantidades de cada producto
  const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});

  // Actualizar la cantidad del producto
  const updateQuantity = (id_producto: number, delta: number) => {
    setProductQuantities((prev) => {
      const newQuantity = Math.max(1, (prev[id_producto] || 1) + delta); // Evitar cantidades menores a 1
      return { ...prev, [id_producto]: newQuantity };
    });
  };

  return (
    <ResponsiveDialogExtended
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Seleccionar Producto"
      description="Selecciona productos para añadir a la orden de trabajo."
    >
      {/* Buscador */}
      <div className="mb-4">
        <Input
          type="text"
          className="border p-2 w-full rounded"
          placeholder="Buscador"
          // Puedes añadir funcionalidad para filtrar productos aquí si lo necesitas
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descripción</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Cant.</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id_producto}>
              <TableCell>{product.nombreProducto}</TableCell>
              <TableCell>${product.precioSinIVA}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => updateQuantity(product.id_producto, -1)}
                    className="h-8 w-8 bg-customGreen hover:bg-customGreenHover rounded-full"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </Button>
                  <Input
                    className="text-center w-14"
                    type="number"
                    value={productQuantities[product.id_producto] || 1} // Valor manejado localmente
                    onChange={(e) =>
                      updateQuantity(product.id_producto, parseInt(e.target.value) - (productQuantities[product.id_producto] || 1))
                    }
                  />
                  <Button
                    onClick={() => updateQuantity(product.id_producto, 1)}
                    className="h-8 w-8 bg-customGreen hover:bg-customGreenHover rounded-full"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Button
                  className="bg-customGreen hover:bg-customGreenHover"
                  onClick={() => onAddProduct(product, productQuantities[product.id_producto] || 1)}
                >
                  Agregar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6 flex justify-end">
        <Button onClick={() => setIsOpen(false)} variant="outline">
          Cancelar
        </Button>
      </div>
    </ResponsiveDialogExtended>
  );
};

export default AddProductModal;
