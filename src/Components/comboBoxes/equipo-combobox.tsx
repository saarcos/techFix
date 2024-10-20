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
import { Equipo } from '@/api/equipoService'; // Asegúrate de importar correctamente la interfaz Equipo
import { cn } from "@/lib/utils";

interface EquipoComboboxProps {
  field: FieldValues;
  equipos: Equipo[];
  isEquipoLoading: boolean;
  disabled?: boolean;  // Añadir prop para controlar si el combobox está deshabilitado
}

export function EquipoCombobox({ field, equipos, isEquipoLoading, disabled }: EquipoComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(field.value?.toString() || "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (id_equipo: string, displayValue: string) => {
    setValue(displayValue); 
    console.log(value);
    field.onChange(parseInt(id_equipo, 10)); 
    setOpen(false);
    setSearchTerm("");
  };

  const filteredEquipos = equipos.filter(equipo =>
    `${equipo.nserie} ${equipo.cliente.nombre} ${equipo.cliente.apellido} ${equipo.modelo.marca.nombre} ${equipo.modelo.nombre}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const selectedEquipo = equipos.find(equipo => equipo.id_equipo.toString() === field.value?.toString());

  const getDisplayValue = (equipo: Equipo) =>
    `${equipo.nserie} - ${equipo.cliente.nombre} ${equipo.cliente.apellido} - ${equipo.modelo.marca.nombre} ${equipo.modelo.nombre}`;

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
          disabled={disabled || isEquipoLoading} // Deshabilitar si no hay cliente seleccionado o si está cargando
        >
          {selectedEquipo ? getDisplayValue(selectedEquipo) : (disabled ? "Primero selecciona un cliente" : "Seleccionar Equipo")}
          <ArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {!disabled && (
        <PopoverContent className="w-full max-w-sm p-0">
          <Command>
            <CommandInput 
              placeholder="Buscar Equipo..." 
              className="h-9" 
              onValueChange={(value) => setSearchTerm(value)} // Actualiza el término de búsqueda
            />
            <CommandList>
              <CommandEmpty>No se encontró ningún equipo.</CommandEmpty>
              <CommandGroup>
                {filteredEquipos.map((equipo) => (
                  <CommandItem
                    key={equipo.id_equipo}
                    value={getDisplayValue(equipo)}
                    onSelect={() => handleSelect(equipo.id_equipo.toString(), getDisplayValue(equipo))}
                  >
                    {getDisplayValue(equipo)}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        field.value?.toString() === equipo.id_equipo.toString() ? "opacity-100" : "opacity-0"
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
