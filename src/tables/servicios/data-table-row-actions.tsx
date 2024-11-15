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
import { Service } from '@/api/servicioService';
import DeleteForm from '@/Components/forms/servicios/service-delete-form';
import ServiceForm from '@/Components/forms/servicios/service-form';
import { getserviceCategories, ServiceCategory } from '@/api/serviceCategories';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveDialogExtended } from '@/Components/responsive-dialog-extended';
import ServiceCategoryForm from '@/Components/forms/serviceCategory/service-category-form';
interface DataTableRowActionsProps {
  row: Row<Service>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false); 
  const { data: serviceCategories=[], error: isServiceCategoriesError} = useQuery<ServiceCategory[]>({
    queryKey: ['serviceCategories'],
    queryFn: getserviceCategories
  });
  if (isServiceCategoriesError) return toast.error('Error al recuperar los datos');


  const serviceId = row.original.id_servicio;
  return (
    <>
      <ResponsiveDialogExtended
        isOpen={isEditOpen}
        setIsOpen={(open) => {
          setIsEditOpen(open);
          if (!open) setIsAddingCategory(false); 
        }}
        title={isAddingCategory ? 'Nueva categoría de servicio' : `Editar información de ${row.original.nombre}`}  
        description={isAddingCategory ? 'Por favor, ingrese la información de la nueva categoría' : 'Por favor, ingresa la información solicitada'}
      >
        {isAddingCategory ? (
          <ServiceCategoryForm setIsOpen={setIsEditOpen} setIsAddingCategory={setIsAddingCategory} />
        ) : (
          <ServiceForm
            key={serviceId || "new"}
            serviceId={serviceId}
            setIsOpen={setIsEditOpen}
            categorias={serviceCategories}
            setIsAddingCategory={setIsAddingCategory} // Permite cambiar al formulario de categorías
          />
        )}
      </ResponsiveDialogExtended>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={`Eliminar del sistema a ${row.original.nombre}`}
        description="¿Estás seguro de que deseas continuar? Esta acción no se puede deshacer."
      >
        <DeleteForm serviceId={serviceId} setIsOpen={setIsDeleteOpen} />
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
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-200"
            >
              <IconMenu text="Modificar" icon={<SquarePen className="h-4 w-4" />} />
            </button>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500">
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
