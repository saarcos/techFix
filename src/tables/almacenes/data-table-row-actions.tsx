import { useState } from 'react';
import DeleteForm from '@/Components/forms/almacenes/almacen-delete-form';
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
import {  MoreHorizontal, Package, SquarePen, Trash2 } from 'lucide-react';
import { Almacen } from '@/api/almacenesService';
import AlmacenForm from '@/Components/forms/almacenes/almacen-form';
import { useNavigate } from 'react-router-dom';
interface DataTableRowActionsProps {
  row: Row<Almacen>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const almacenId = row.original.id_almacen;

  const navigate = useNavigate(); // Definir el hook useNavigate

  const handleGestionarInventarioClick = () => {
    if (almacenId) {
      navigate(`/taller/almacenes/inventario/${almacenId}`);
    }
  };
  return (
    <>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={`Editar información de ${row.original.nombre}`}
        description='Por favor, ingresa la información solicitada'
      >
        <AlmacenForm almacenId={almacenId} setIsOpen={setIsEditOpen}  />
      </ResponsiveDialog>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={`Eliminar del sistema a ${row.original.nombre}`}
        description="¿Estás seguro de que deseas continuar? Esta acción no se puede deshacer."
      >
        <DeleteForm almacenId={almacenId} setIsOpen={setIsDeleteOpen} />
      </ResponsiveDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Desplegar menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] z-50">
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
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500  ">
              <Button 
                onClick={()=>handleGestionarInventarioClick()}
                variant="ghost"
                className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100" >
                <IconMenu text="Gestionar inventario" icon={<Package className="h-4 w-4" />} />
              </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
