import Spinner from '../assets/tube-spinner.svg';
import { toast } from 'sonner';
import { getClients, Client } from '@/api/clientService';
import { DataTable } from '@/Components/data-table';
import { Button } from '@/Components/ui/button';
import { columns } from '../tables/clientes/columns';
import { PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveDialog } from '@/Components/responsive-dialog';
import { useRef, useState } from 'react';
import UserForm from '@/Components/forms/clientes/client-form';

const Clientes = () => {
  const dialogRef = useRef<HTMLButtonElement>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: clients = [], isLoading, error } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  if (isLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
  if (error) return toast.error('Error al recuperar los datos');

  return (
    <div>
      <div className='container py-10 mx-auto'>
        <div className="ml-auto flex items-center gap-2">
          <ResponsiveDialog
            isOpen={isCreateOpen}
            setIsOpen={setIsCreateOpen}
            title={`Nuevo cliente`}
            description='Por favor, ingresa la información solicitada'
          >
            <UserForm setIsOpen={setIsCreateOpen} />
          </ResponsiveDialog>
          <Button 
            size="sm"
            className="h-8 gap-1 bg-customGreen hover:bg-customGreenHover"
            ref={dialogRef}
            onClick={() => setIsCreateOpen(true)}  // Aquí se abre el diálogo
          >
            <PlusCircle className="h-3.5 w-3.5 text-black" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-black">
              Nuevo cliente
            </span>
          </Button>
        </div>
        <DataTable data={clients ?? []} columns={columns} globalFilterColumn='nombre' />
      </div>
    </div>
  );
};

export default Clientes;
