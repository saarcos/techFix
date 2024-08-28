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
import { User } from '@/api/userService'; // Asegúrate de importar correctamente la interfaz User
import { cn } from "@/lib/utils";

interface TecnicoComboboxProps {
  field: FieldValues;
  tecnicos: User[];
  isTecnicoLoading: boolean;
}

export function TecnicoCombobox({ field, tecnicos, isTecnicoLoading }: TecnicoComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(field.value?.toString() || "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (id_usuario: string, displayValue: string) => {
    setValue(displayValue); 
    console.log(value);
    field.onChange(parseInt(id_usuario, 10)); 
    setOpen(false);
  };

  const filteredTecnicos = tecnicos.filter(tecnico =>
    `${tecnico.nombre} ${tecnico.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTecnico = tecnicos.find(tecnico => tecnico.id_usuario.toString() === field.value?.toString());

  const getDisplayValue = (tecnico: User) => `${tecnico.nombre} ${tecnico.apellido}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10"
          disabled={isTecnicoLoading}
        >
          {selectedTecnico ? getDisplayValue(selectedTecnico) : "Seleccionar Técnico"}
          <ArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full sm:w-auto p-0">
        <Command>
          <CommandInput 
            placeholder="Buscar Técnico..." 
            className="h-9" 
            onValueChange={(value) => setSearchTerm(value)} // Actualiza el término de búsqueda
          />
          <CommandList>
            <CommandEmpty>No se encontró ningún técnico.</CommandEmpty>
            <CommandGroup>
              {filteredTecnicos.map((tecnico) => (
                <CommandItem
                  key={tecnico.id_usuario}
                  value={getDisplayValue(tecnico)}
                  onSelect={() => handleSelect(tecnico.id_usuario.toString(), getDisplayValue(tecnico))}
                >
                  {getDisplayValue(tecnico)}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      field.value?.toString() === tecnico.id_usuario.toString() ? "opacity-100" : "opacity-0"
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
