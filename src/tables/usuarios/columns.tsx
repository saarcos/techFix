import { User } from "@/api/userService";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/table-core";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import DatatableColumnHeader from '@/Components/datatable-column-header'

export const columns: ColumnDef<User>[]=[
    {
        accessorKey: "nombre",
        header: ({column})=>(
          <DatatableColumnHeader title="Nombre" column={column}/>
        ),
        cell: info => `${info.row.original.nombre} ${info.row.original.apellido}`
    },
    {
        accessorKey: "rol.nombrerol", // Acceder al nombre del rol
        header: ({column})=>(
          <DatatableColumnHeader title="Rol" column={column}/>
        ),
    },
    {
        accessorKey: "email",
        header: "Correo",
        cell: ({row})=>(
          <a href={`mailto:${row.getValue("email")}`}
          className="font-medium text-blue-600 hover:underline">
            {row.getValue("email")}
          </a>
        ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Más opciones</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer"><FontAwesomeIcon icon={faPencil} className="mr-1"/> Modificar</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer"><FontAwesomeIcon icon={faTrash} className="mr-1"/> Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }
];