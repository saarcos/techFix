import { Dispatch, SetStateAction, useState } from 'react';
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
import { Client } from '@/api/clientService'; // Asegúrate de importar correctamente la interfaz Client
import { cn } from "@/lib/utils";

interface ClienteComboboxProps {
  field: FieldValues;
  clientes: Client[];
  isClienteLoading: boolean;
  setSelectedClient:Dispatch<SetStateAction<number>>;
  disabled?: boolean; // Nueva propiedad para controlar si el combobox está deshabilitado
}

export function ClienteCombobox({ field, clientes, isClienteLoading, setSelectedClient, disabled }: ClienteComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(field.value?.toString() || "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (id_cliente: string, displayValue: string) => {
    setValue(displayValue); 
    console.log(value);
    field.onChange(parseInt(id_cliente, 10)); 
    setSelectedClient(parseInt(id_cliente,10))
    setOpen(false);
  };

  const filteredClientes = clientes.filter(cliente =>
    `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCliente = clientes.find(cliente => cliente.id_cliente.toString() === field.value?.toString());

  const getDisplayValue = (cliente: Client) => `${cliente.nombre} ${cliente.apellido}`;

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
          disabled={isClienteLoading || disabled}  // Deshabilitar el botón si está cargando o si está deshabilitado
        >
          {selectedCliente ? getDisplayValue(selectedCliente) : "Seleccionar Cliente"}
          <ArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {!disabled && ( // Evitar que el Popover se abra si está deshabilitado
        <PopoverContent className="w-full sm:w-auto p-0">
          <Command>
            <CommandInput 
              placeholder="Buscar Cliente..." 
              className="h-9" 
              onValueChange={(value) => setSearchTerm(value)} // Actualiza el término de búsqueda
            />
            <CommandList>
              <CommandEmpty>No se encontró ningún cliente.</CommandEmpty>
              <CommandGroup>
                {filteredClientes.map((cliente) => (
                  <CommandItem
                    key={cliente.id_cliente}
                    value={getDisplayValue(cliente)}
                    onSelect={() => handleSelect(cliente.id_cliente.toString(), getDisplayValue(cliente))}
                  >
                    {getDisplayValue(cliente)}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        field.value?.toString() === cliente.id_cliente.toString() ? "opacity-100" : "opacity-0"
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
