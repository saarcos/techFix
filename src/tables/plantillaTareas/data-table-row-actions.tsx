import { useState } from 'react';
import IconMenu from '@/Components/icon-menu';
import { ResponsiveDialog } from '@/Components/responsive-dialog';
import { Button } from '@/Components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { ResponsiveDialogExtended } from '@/Components/responsive-dialog-extended';
import { Plantilla } from '@/api/plantillaService';
import PlantillaForm from '@/Components/forms/plantillas/plantilla-form';
import TareaForm from '@/Components/forms/tareas/tarea-form';
import DeleteForm from '@/Components/forms/plantillas/plantilla-delete-form';

interface DataTableRowActionsProps {
  row: Row<Plantilla>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);


  const plantillaId = row.original.id_grupo;
  return (
    <>
      <ResponsiveDialogExtended
        isOpen={isEditOpen}
        setIsOpen={(open) => {
          setIsEditOpen(open);
          if (!open) setIsCreatingTask(false);
        }}
        title={`Editar información de ${row.original.descripcion}`}
        description={'Por favor, ingresa la información solicitada'}
      >
        {isCreatingTask ? (
          <TareaForm setIsOpen={setIsEditOpen} setIsCreatingTask={setIsCreatingTask} />
        ) : (
          <PlantillaForm
            plantillaId={plantillaId}
            setIsOpen={setIsEditOpen}
            setIsCreatingTask={setIsCreatingTask} // Permite cambiar al formulario de categorías
          />
        )}
      </ResponsiveDialogExtended>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={`Eliminar del sistema a ${row.original.descripcion}`}
        description="¿Estás seguro de que deseas continuar? Esta acción no se puede deshacer."
      >
        <DeleteForm plantillaId={plantillaId} setIsOpen={setIsDeleteOpen} />
      </ResponsiveDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Desplegar menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] z-50">
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
            <button
              onClick={() => {
                setIsEditOpen(true);
              }}
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
            >
              <IconMenu text="Modificar" icon={<SquarePen className="h-4 w-4" />} />
            </button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
            <button
              onClick={() => {
                setIsDeleteOpen(true);
              }}
              className="w-full justify-start flex text-red-500 rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
            >
              <IconMenu text="Eliminar" icon={<Trash2 className="h-4 w-4" />} />
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
