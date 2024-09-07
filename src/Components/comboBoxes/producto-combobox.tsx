import { useState } from 'react';
import { Button } from '@/Components/ui/button';
import { ArrowDown, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/Components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/Components/ui/command';
import { FieldValues } from 'react-hook-form';
import { Product } from '@/api/productsService'; // Asegúrate de importar correctamente la interfaz Product
import { cn } from "@/lib/utils";

interface ProductComboboxProps {
  field: FieldValues;
  products: Product[];
  isProductLoading: boolean;
  disabled: boolean;  // Añadir prop para controlar si el combobox está deshabilitado
}

export function ProductCombobox({ field, products, isProductLoading, disabled }: ProductComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(field.value?.toString() || "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (id_producto: string, displayValue: string) => {
    setValue(displayValue); 
    console.log(value);
    field.onChange(parseInt(id_producto, 10)); 
    setOpen(false);
  };

  const filteredProducts = products.filter(product =>
    `${product.nombreProducto} ${product.codigoProducto} ${product.categoriaProducto.nombreCat}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const selectedProduct = products.find(product => product.id_producto.toString() === field.value?.toString());

  const getDisplayValue = (product: Product) =>
    `${product.nombreProducto} - ${product.codigoProducto} - ${product.categoriaProducto.nombreCat}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-10 sm:h-10 text-sm overflow-hidden text-ellipsis whitespace-nowrap",
            disabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-background text-black cursor-pointer"
          )}
          disabled={disabled || isProductLoading} // Deshabilitar si está cargando o si está deshabilitado
        >
          {selectedProduct ? getDisplayValue(selectedProduct) : (disabled ? "Primero selecciona una categoría" : "Seleccionar Producto")}
          <ArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-full max-w-sm p-0">
          <Command>
            <CommandInput 
              placeholder="Buscar Producto..." 
              className="h-9" 
              onValueChange={(value) => setSearchTerm(value)} // Actualiza el término de búsqueda
            />
            <CommandList>
              <CommandEmpty>No se encontró ningún producto.</CommandEmpty>
              <CommandGroup>
                {filteredProducts.map((product) => (
                  <CommandItem
                    key={product.id_producto}
                    value={getDisplayValue(product)}
                    onSelect={() => handleSelect(product.id_producto.toString(), getDisplayValue(product))}
                  >
                    {getDisplayValue(product)}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        field.value?.toString() === product.id_producto.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
