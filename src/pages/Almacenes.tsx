import Spinner from '../assets/tube-spinner.svg';
import { toast } from 'sonner';
import { DataTable } from '@/Components/data-table';
import { Button } from '@/Components/ui/button';
import { columns } from '../tables/almacenes/columns';
import { PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveDialog } from '@/Components/responsive-dialog';
import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Almacen, getAlmacenes } from '@/api/almacenesService';
import AlmacenForm from '@/Components/forms/almacenes/almacen-form';

const Almacenes = () => {
  const dialogRef = useRef<HTMLButtonElement>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: almacenes = [], isLoading, error } = useQuery<Almacen[]>({
    queryKey: ['almacenes'],
    queryFn: getAlmacenes,
  });

  if (isLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
  if (error) return toast.error('Error al recuperar los datos');

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 mt-5">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full max-w-9xl overflow-x-auto">
          <CardHeader>
            <CardTitle>Almacenes</CardTitle>
            <CardDescription>
              Administra el inventario de los almacenes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveDialog
                isOpen={isCreateOpen}
                setIsOpen={setIsCreateOpen}
                title={`Nuevo almacén`}
                description='Por favor, ingresa la información solicitada'
              >
              <AlmacenForm setIsOpen={setIsCreateOpen} />
            </ResponsiveDialog>
              <Button 
                size="sm"
                className="h-8 gap-1 bg-customGreen hover:bg-customGreenHover"
                ref={dialogRef}
                onClick={() => setIsCreateOpen(true)}  // Aquí se abre el diálogo
              >
              <PlusCircle className="h-3.5 w-3.5 text-black" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-black">
                Nuevo almacén
              </span>
              </Button>
              <DataTable data={almacenes ?? []} columns={columns} globalFilterColumn='nombre' />
          </CardContent>  
        </Card>
      </main>
      </div>
  );
};

export default Almacenes;
