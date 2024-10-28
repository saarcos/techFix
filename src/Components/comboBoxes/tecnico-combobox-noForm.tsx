import { useState, useEffect } from 'react';
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
import { User } from '@/api/userService';
import { cn } from "@/lib/utils";

interface TecnicoComboboxNoFormProps {
  tecnicos: User[];
  isTecnicoLoading: boolean;
  onSelect: (id_usuario: number) => void;
  defaultSelectedId?: number;
}

export function TecnicoComboboxNoForm({
  tecnicos,
  isTecnicoLoading,
  onSelect,
  defaultSelectedId,
}: TecnicoComboboxNoFormProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(defaultSelectedId ? defaultSelectedId.toString() : "");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (defaultSelectedId) {
      setSelectedId(defaultSelectedId.toString());
    }
  }, [defaultSelectedId]);

  const handleSelect = (id_usuario: string, displayValue: string) => {
    console.log(displayValue);
    setSelectedId(id_usuario);
    setOpen(false);
    setSearchTerm("");
    onSelect(parseInt(id_usuario, 10));
  };

  const filteredTecnicos = tecnicos.filter((tecnico) =>
    `${tecnico.nombre} ${tecnico.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedTecnico = tecnicos.find(
    (tecnico) => tecnico.id_usuario.toString() === selectedId
  );

  const getDisplayValue = (tecnico: User) => `${tecnico.nombre} ${tecnico.apellido}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-40 h-8 text-sm justify-between px-2 py-1" // Ajusta el ancho, alto, tamaño de texto, y padding
          disabled={isTecnicoLoading}
        >
          {selectedTecnico ? getDisplayValue(selectedTecnico) : "Seleccionar Técnico"}
          <ArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0"> {/* Ajusta el ancho del Popover aquí */}
        <Command>
          <CommandInput
            placeholder="Buscar Técnico..."
            className="h-8 text-sm" // Reduce altura y tamaño de texto
            onValueChange={(value) => setSearchTerm(value)}
          />
          <CommandList>
            <CommandEmpty>No se encontró ningún técnico.</CommandEmpty>
            <CommandGroup>
              {filteredTecnicos.map((tecnico) => (
                <CommandItem
                  key={tecnico.id_usuario}
                  value={getDisplayValue(tecnico)}
                  onSelect={() =>
                    handleSelect(tecnico.id_usuario.toString(), getDisplayValue(tecnico))
                  }
                >
                  {getDisplayValue(tecnico)}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedId === tecnico.id_usuario.toString() ? "opacity-100" : "opacity-0"
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
