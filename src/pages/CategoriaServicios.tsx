import Spinner from '../assets/tube-spinner.svg';
import { toast } from 'sonner';
import { DataTable } from '@/Components/data-table';
import { Button } from '@/Components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { getserviceCategories, ServiceCategory } from '@/api/serviceCategories';
import { ResponsiveDialog } from '@/Components/responsive-dialog';
import ServiceCategoryForm from '@/Components/forms/serviceCategory/service-category-form';
import { columns } from '@/tables/categoriaServicio/columns';

const CategoriaServicios = () => {
  const dialogRef = useRef<HTMLButtonElement>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: serviceCategories=[], isLoading: isServiceCategoriesLoading, error: isServiceCategoriesError} = useQuery<ServiceCategory[]>({
    queryKey: ['serviceCategories'],
    queryFn: getserviceCategories
  });

  if (isServiceCategoriesLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
  if (isServiceCategoriesError) return toast.error('Error al recuperar los datos');

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 mt-5">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full max-w-9xl overflow-x-auto">
          <CardHeader>
            <CardTitle>Categorías de servicio</CardTitle>
            <CardDescription>
              Administra las categorías de los servicios ofertados en el taller.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveDialog
                isOpen={isCreateOpen}
                setIsOpen={setIsCreateOpen}
                title={`Nueva categoría de servicio`}
                description='Por favor, ingresa la información solicitada'
              >
              <ServiceCategoryForm setIsOpen={setIsCreateOpen} />
            </ResponsiveDialog>
              <Button 
                size="sm"
                className="h-8 gap-1 bg-customGreen hover:bg-customGreenHover"
                ref={dialogRef}
                onClick={() => setIsCreateOpen(true)}  // Aquí se abre el diálogo
              >
              <PlusCircle className="h-3.5 w-3.5 text-black" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-black">
                Nuevo servicio
              </span>
              </Button>
              <DataTable data={serviceCategories ?? []} columns={columns} globalFilterColumn='nombreCat' />
          </CardContent>  
        </Card>
      </main>
      </div>
  );
};

export default CategoriaServicios;
