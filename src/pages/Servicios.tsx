import Spinner from '../assets/tube-spinner.svg';
import { toast } from 'sonner';
import { DataTable } from '@/Components/data-table';
import { Button } from '@/Components/ui/button';
import { columns } from '../tables/servicios/columns';
import { PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { getServices, Service } from '@/api/servicioService';
import { ResponsiveDialogExtended } from '@/Components/responsive-dialog-extended';
import ServiceForm from '@/Components/forms/servicios/service-form';
import { getserviceCategories, ServiceCategory } from '@/api/serviceCategories';
import ServiceCategoryForm from '@/Components/forms/serviceCategory/service-category-form';

const Servicios = () => {
  const dialogRef = useRef<HTMLButtonElement>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false); // Estado para controlar el formulario a mostrar
  const { data: services = [], isLoading, error } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: getServices,
  });
  const { data: serviceCategories=[], isLoading: isServiceCategoriesLoading, error: isServiceCategoriesError} = useQuery<ServiceCategory[]>({
    queryKey: ['serviceCategories'],
    queryFn: getserviceCategories
  });

  if (isLoading || isServiceCategoriesLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
  if (error || isServiceCategoriesError) return toast.error('Error al recuperar los datos');

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 mt-5">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full max-w-9xl overflow-x-auto">
          <CardHeader>
            <CardTitle>Servicios</CardTitle>
            <CardDescription>
              Administra los servicios disponibles en el taller.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveDialogExtended
              isOpen={isCreateOpen}
              setIsOpen={(open) => {
                setIsCreateOpen(open);
                if (!open) setIsAddingCategory(false); // Reiniciar el estado al cerrar el diálogo
              }}
              title={isAddingCategory ? 'Nueva categoría de servicio' : 'Nuevo servicio'}  
              description={isAddingCategory ? 'Por favor, ingrese la información de la nueva categoría' : 'Por favor, ingresa la información solicitada'}
            >
              {isAddingCategory ? (
                <ServiceCategoryForm setIsOpen={setIsCreateOpen} setIsAddingCategory={setIsAddingCategory} />
              ) : (
                <ServiceForm
                  setIsOpen={setIsCreateOpen}
                  categorias={serviceCategories}
                  setIsAddingCategory={setIsAddingCategory} // Permite cambiar al formulario de categorías
                />
              )}
            </ResponsiveDialogExtended>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-8 gap-1 bg-customGreen hover:bg-customGreenHover"
                ref={dialogRef}
                onClick={() => {
                  setIsCreateOpen(true);
                  setIsAddingCategory(false); // Mostrar el formulario de servicio por defecto
                }}
              >
                <PlusCircle className="h-3.5 w-3.5 text-black" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-black">
                  Nuevo servicio
                </span>
              </Button>
            </div>
            <DataTable data={services ?? []} columns={columns} globalFilterColumn="nombre" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Servicios;
