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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

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
    <div className="flex  w-full flex-col bg-muted/40 mt-5">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full max-w-9xl overflow-x-auto">
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Administra los clientes del taller.
            </CardDescription>
          </CardHeader>
          <CardContent>
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
              <DataTable data={clients ?? []} columns={columns} globalFilterColumn='nombre' />
          </CardContent>  
        </Card>
      </main>
      </div>
  );
};

export default Clientes;
