import Spinner from '../assets/tube-spinner.svg';
import { toast } from 'sonner';
import { DataTable } from '@/Components/data-table';
import { Button } from '@/Components/ui/button';
import { columns } from '../tables/plantillaTareas/columns';
import { PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { getPlantillas, Plantilla } from '@/api/plantillaService';
import PlantillaForm from '@/Components/forms/plantillas/plantilla-form';
import { ResponsiveDialogExtended } from '@/Components/responsive-dialog-extended';
import TareaForm from '@/Components/forms/tareas/tarea-form';

const Tareas = () => {
  const dialogRef = useRef<HTMLButtonElement>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false); // Nuevo estado para controlar qué formulario mostrar
  const { data: plantillas = [], isLoading, error } = useQuery<Plantilla[]>({
    queryKey: ['plantillas'],
    queryFn: getPlantillas,
  });

  if (isLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
  if (error) return toast.error('Error al recuperar los datos');

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 mt-5">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full max-w-9xl overflow-x-auto">
          <CardHeader>
            <CardTitle>Tareas</CardTitle>
            <CardDescription>
              Administra las tareas que se desempeñan en el taller.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveDialogExtended
              isOpen={isCreateOpen}
              setIsOpen={(open) => {
                setIsCreateOpen(open);
                if (!open) {
                  setIsCreatingTask(false);
                }
              }}
              title={isCreatingTask ? `Nueva tarea individual` : `Nueva plantilla`}
              description={isCreatingTask ? 'Por favor, ingresa los detalles de la tarea' : 'Por favor, ingresa la información de la plantilla'}
            >
              {isCreatingTask ? (
                <TareaForm setIsOpen={setIsCreateOpen} setIsCreatingTask={setIsCreatingTask} />
              ) : (
                <PlantillaForm setIsOpen={setIsCreateOpen} setIsCreatingTask={setIsCreatingTask} />
              )}
            </ResponsiveDialogExtended>
            <div className='flex items-center gap-1'>
              <Button
                size="sm"
                className="h-8 gap-1 bg-customGreen hover:bg-customGreenHover"
                ref={dialogRef}
                onClick={() => setIsCreateOpen(true)}  // Aquí se abre el diálogo
              >
                <PlusCircle className="h-3.5 w-3.5 text-black" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-black">
                  Crear nueva plantilla de tareas
                </span>
              </Button>
            </div>
            <DataTable data={plantillas ?? []} columns={columns} globalFilterColumn='descripcion' />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Tareas;
