
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
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Brand, getBrands } from '@/api/marcasService';
import { getModels, Model } from '@/api/modeloService';
import { Client, getClients } from '@/api/clientService';
import { DeviceType, getDeviceTypes } from '@/api/tipoEquipoService';
import { toast } from 'sonner';
import EquipoForm from '@/Components/forms/equipos/equipo-form';
import { ResponsiveDialogExtended } from '@/Components/responsive-dialog-extended';
import DeleteForm from '@/Components/forms/equipos/equipo-delete-form';
import { ResponsiveDialog } from '@/Components/responsive-dialog';
interface DataTableRowActionsProps {
  row: Row<Equipo>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const {data: marcas=[],  isLoadingError: marcasError} = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: getBrands,
  });
  const {data: modelos=[],  isLoadingError: modelsError} = useQuery<Model[]>({
    queryKey: ['models'],
    queryFn: getModels,
  });
  const {data: propietarios=[],  isLoadingError: ownersError} = useQuery<Client[]>({
    queryKey: ['owners'],
    queryFn: getClients,
  });
  const {data: tiposEquipo=[],  isLoadingError: deviceTypesError} = useQuery<DeviceType[]>({
    queryKey: ['deviceTypes'],
    queryFn: getDeviceTypes,
  });
  if ( marcasError||modelsError||ownersError||deviceTypesError) return toast.error('Error al recuperar los datos');

  const deviceId = row.original.id_equipo;
  return (
    <>
      <ResponsiveDialogExtended
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title={`Editar información de ${row.original.modelo.nombre} ${row.original.nserie}`}
      >
        <EquipoForm equipoId={deviceId} setIsOpen={setIsEditOpen} brands={marcas} models={modelos} owners={propietarios} deviceTypes={tiposEquipo} />
      </ResponsiveDialogExtended>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={`Eliminar del sistema a ${row.original.modelo.nombre} ${row.original.nserie}`}
        description="¿Estás seguro de que deseas continuar? Esta acción no se puede deshacer."
      >
        <DeleteForm deviceId={deviceId} setIsOpen={setIsDeleteOpen} />
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
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500  ">
              <button className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100" >
                <IconMenu text="Ver historial" icon={<EyeIcon className="h-4 w-4" />} />
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
