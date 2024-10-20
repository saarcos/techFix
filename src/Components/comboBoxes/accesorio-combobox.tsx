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
import { cn } from "@/lib/utils";
import { Accesorio } from '@/api/accesorioService';

interface AccesoriosComboboxProps {
  accesorios: Accesorio[];
  onSelect: (accesorio: Accesorio) => void; // Pasar el accesorio seleccionado al padre
}

export function AccesoriosCombobox({ accesorios, onSelect }: AccesoriosComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccesorio, setSelectedAccesorio] = useState<Accesorio | null>(null); // Estado para el accesorio seleccionado

  const filteredAccesorios = accesorios.filter((accesorio) =>
    accesorio.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (accesorio: Accesorio) => {
    setSelectedAccesorio(accesorio); // Actualiza el accesorio seleccionado
    onSelect(accesorio); // Llama a la función onSelect del padre
    setOpen(false);
    setSearchTerm('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-10 sm:h-10 text-sm overflow-hidden text-ellipsis whitespace-nowrap bg-background text-black cursor-pointer mt-2"
          )}
        >
          {selectedAccesorio ? selectedAccesorio.nombre : 'Seleccionar Accesorio'}
          <ArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-sm p-0">
        <Command>
          <CommandInput
            placeholder="Buscar Accesorio..."
            className="h-9"
            onValueChange={(value) => setSearchTerm(value)}
          />
          <CommandList>
            <CommandEmpty>No se encontraron accesorios.</CommandEmpty>
            <CommandGroup>
              {filteredAccesorios.map((accesorio) => (
                <CommandItem
                  key={accesorio.id_accesorio}
                  onSelect={() => handleSelect(accesorio)}
                >
                  {accesorio.nombre}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedAccesorio?.id_accesorio === accesorio.id_accesorio ? "opacity-100" : "opacity-0"
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
