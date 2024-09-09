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
import { Tarea } from '@/api/plantillaService';
import { cn } from "@/lib/utils";

interface TaskComboboxProps {
  field: FieldValues;
  tasks: Tarea[];
}

export function TaskCombobox({ field, tasks }: TaskComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(field.value?.toString() || "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (id_tarea: string, displayValue: string) => {
    setValue(displayValue); 
    console.log(value)
    field.onChange(parseInt(id_tarea, 10)); 
    setOpen(false);
  };

  const filteredTasks = tasks.filter(task =>
    `${task.titulo} ${task.descripcion}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const selectedTask = tasks.find(task => task.id_tarea.toString() === field.value?.toString());

  const getDisplayValue = (task: Tarea) =>
    `${task.titulo} - ${task.descripcion}`;

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
          {selectedTask ? getDisplayValue(selectedTask) :  "Seleccionar Tarea"}
          <ArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
        <PopoverContent className="w-full max-w-sm p-0">
          <Command>
            <CommandInput 
              placeholder="Buscar Tarea..." 
              className="h-9" 
              onValueChange={(value) => setSearchTerm(value)} // Actualiza el término de búsqueda
            />
            <CommandList>
              <CommandEmpty>No se encontró ninguna tarea.</CommandEmpty>
              <CommandGroup>
                {filteredTasks.map((task) => (
                  <CommandItem
                    key={task.id_tarea}
                    value={getDisplayValue(task)}
                    onSelect={() => handleSelect(task.id_tarea.toString(), getDisplayValue(task))}
                  >
                    {getDisplayValue(task)}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        field.value?.toString() === task.id_tarea.toString() ? "opacity-100" : "opacity-0"
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
