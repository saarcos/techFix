
import IconMenu from '@/Components/icon-menu';
import { Button } from '@/Components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Row } from '@tanstack/react-table';
import { EyeIcon, MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { Equipo } from '@/api/equipoService';
interface DataTableRowActionsProps {
  row: Row<Equipo>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  // const [isEditOpen, setIsEditOpen] = useState(false);
  // const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  console.log(row)
  // const { data: roles = [], isError: rolesError } = useQuery<Role[]>({
  //   queryKey: ['roles'],
  //   queryFn: getRoles,
  // });
  // if (rolesError) return toast.error('Error al recuperar los datos');

  // const userId = row.original.id_usuario;
  return (
    <>
      {/* <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={`Editar información de ${row.original.nombre}`}
      >
        <EditForm userId={userId} setIsOpen={setIsEditOpen} roles={roles} />
      </ResponsiveDialog>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={`Eliminar del sistema a ${row.original.nombre}`}
        description="¿Estás seguro de que deseas continuar? Esta acción no se puede deshacer."
      >
        <DeleteForm userId={userId} setIsOpen={setIsDeleteOpen} />
      </ResponsiveDialog> */}
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
              // onClick={() => {
              //   setIsEditOpen(true);
              // }}
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
            >
              <IconMenu text="Modificar" icon={<SquarePen className="h-4 w-4" />} />
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500  ">
              <button className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100" >
                <IconMenu text="Ver historial" icon={<EyeIcon className="h-4 w-4" />} />
              </button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
            <button
              // onClick={() => {
              //   setIsDeleteOpen(true);
              // }}
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
