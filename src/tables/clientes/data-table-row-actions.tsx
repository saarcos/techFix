import { useState } from 'react';
import DeleteForm from '@/Components/forms/clientes/client-delete-form';
import UserForm from '@/Components/forms/clientes/client-form';
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
import { MoreHorizontal, SquarePen, Trash2, EyeIcon } from 'lucide-react';
import { Client } from '@/api/clientService';
import { Link } from 'react-router-dom';
interface DataTableRowActionsProps {
  row: Row<Client>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);


  const userId = row.original.id_cliente;
  return (
    <>
      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={`Editar información de ${row.original.nombre}`}
        description='Por favor, ingresa la información solicitada'
      >
        <UserForm clienteId={userId} setIsOpen={setIsEditOpen}  />
      </ResponsiveDialog>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={`Eliminar del sistema a ${row.original.nombre}`}
        description="¿Estás seguro de que deseas continuar? Esta acción no se puede deshacer."
      >
        <DeleteForm clienteId={userId} setIsOpen={setIsDeleteOpen} />
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
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500  ">
            <Link
              to={`/taller/cliente/${userId}/ordenes`}
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
            >
              <IconMenu text="Ver historial" icon={<EyeIcon className="h-4 w-4" />} />
            </Link>
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
