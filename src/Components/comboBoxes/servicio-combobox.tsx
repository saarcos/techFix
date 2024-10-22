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
import { Service } from '@/api/servicioService'; // Asegúrate de importar correctamente la interfaz Service
import { cn } from "@/lib/utils";

interface ServiceComboboxProps {
  field: FieldValues;
  services: Service[];
}

export function ServiceCombobox({ field, services }: ServiceComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(field.value?.toString() || "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (id_servicio: string, displayValue: string) => {
    setValue(displayValue); 
    console.log(value);
    field.onChange(parseInt(id_servicio, 10)); 
    setOpen(false);
    setSearchTerm("");
  };

  const filteredServices = services.filter(service =>
    `${service.nombre} ${service.preciofinal} ${service.categoriaServicio.nombreCat}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const selectedService = services.find(service => service.id_servicio.toString() === field.value?.toString());

  const getDisplayValue = (service: Service) =>
    `${service.nombre} - ${service.preciofinal} - ${service.categoriaServicio.nombreCat}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-10 sm:h-10 text-sm overflow-hidden text-ellipsis whitespace-nowrap bg-background text-black cursor-pointer mt-2",
          )}
        >
          {selectedService ? getDisplayValue(selectedService) :  "Seleccionar Servicio"}
          <ArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-sm p-0">
        <Command>
          <CommandInput 
            placeholder="Buscar Servicio..." 
            className="h-9" 
            onValueChange={(value) => setSearchTerm(value)} // Actualiza el término de búsqueda
          />
          <CommandList>
            <CommandEmpty>No se encontró ningún servicio.</CommandEmpty>
            <CommandGroup>
              {filteredServices.map((service) => (
                <CommandItem
                  key={service.id_servicio}
                  value={getDisplayValue(service)}
                  onSelect={() => handleSelect(service.id_servicio.toString(), getDisplayValue(service))}
                >
                  {getDisplayValue(service)}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      field.value?.toString() === service.id_servicio.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
