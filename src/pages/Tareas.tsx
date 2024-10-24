import Spinner from '../assets/tube-spinner.svg';
import { toast } from 'sonner';
import { DataTable } from '@/Components/data-table';
import { Button } from '@/Components/ui/button';
import { columns } from '../tables/tareas/columns';
import { PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { ResponsiveDialogExtended } from '@/Components/responsive-dialog-extended';
import TareaForm from '@/Components/forms/tareas/tarea-form';
import { getTareas, Tarea } from '@/api/tareaService';

const Tareas = () => {
    const dialogRef = useRef<HTMLButtonElement>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { data: tareas = [], isLoading, error } = useQuery<Tarea[]>({
        queryKey: ['tareas'],
        queryFn: getTareas,
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
                            Administra las tareas por asignar en el taller.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveDialogExtended
                            isOpen={isCreateOpen}
                            setIsOpen={setIsCreateOpen}
                            title={`Nueva tarea individual`}
                            description={'Por favor, ingresa los detalles de la tarea'}
                        >
                            <div className="max-h-[80vh] overflow-y-auto w-full">
                                <TareaForm setIsOpen={setIsCreateOpen} setIsCreatingTask={setIsCreateOpen} />
                            </div>
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
                                    Crear nueva tarea
                                </span>
                            </Button>
                        </div>
                        <DataTable data={tareas ?? []} columns={columns} globalFilterColumn='titulo' />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default Tareas;
