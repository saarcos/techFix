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
import { Plantilla } from '@/api/plantillaService';

interface PlantillaComboboxProps {
  plantillas: Plantilla[];
  onSelect: (plantilla: Plantilla) => void; // Pasar la plantilla seleccionada al padre
}

export function PlantillaCombobox({ plantillas, onSelect }: PlantillaComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlantillas = plantillas.filter((plantilla) =>
    plantilla.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          {'Seleccionar Plantilla'}
          <ArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-sm p-0">
        <Command>
          <CommandInput
            placeholder="Buscar Plantilla..."
            className="h-9"
            onValueChange={(value) => setSearchTerm(value)}
          />
          <CommandList>
            <CommandEmpty>No se encontraron plantillas.</CommandEmpty>
            <CommandGroup>
              {filteredPlantillas.map((plantilla) => (
                <CommandItem
                  key={plantilla.id_grupo}
                  onSelect={() => {
                    onSelect(plantilla); // Al seleccionar, lo pasamos al padre
                    setOpen(false);
                  }}
                >
                  {plantilla.descripcion}
                  <Check className="ml-auto h-4 w-4 opacity-0" />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
