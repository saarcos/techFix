import { createPlantilla, getPlantillaById, Plantilla, Tarea, TareaAnidada, updatePlantilla } from '@/api/plantillaService';
import { Button } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, X } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { getTareas } from '@/api/tareaService';
import Spinner from '../../../assets/tube-spinner.svg';
import { TaskCombobox } from '@/Components/comboBoxes/tarea-combobox';

const plantillaSchema = z.object({
    descripcion: z.string().min(1, 'La descripción es necesaria'),
    tareas: z.array(z.object({
        id: z.number(),
        nombre: z.string(),
    })).optional(),  // Ahora el array de tareas es opcional
});

interface Task {
    id: number;
    nombre: string;
}

interface PlantillaFormProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setIsCreatingTask: Dispatch<SetStateAction<boolean>>; // Nuevo prop para controlar el renderizado condicional
    plantillaId?: number;
    initialTareas?: Task[];
}

export default function PlantillaForm({ setIsOpen, setIsCreatingTask, plantillaId, initialTareas = [] }: PlantillaFormProps) {
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [addedTasks, setAddedTasks] = useState<Task[]>(initialTareas);
    const { data: tareas = [], isLoading: isTareasLoading, error } = useQuery<Tarea[]>({
        queryKey: ['tasks'],
        queryFn: getTareas,
    });
    const { data: plantilla, isLoading: isPlantillaLoading, isError } = useQuery<Plantilla>({
        queryKey: ['plantilla', plantillaId],
        queryFn: () =>
            plantillaId
                ? getPlantillaById(plantillaId)
                : Promise.resolve({
                      id_grupo: 0,
                      descripcion: '',
                      tareas: [],  // Array vacío de tareas anidadas
                  } as Plantilla),
        enabled: !!plantillaId,  // Solo ejecuta la consulta si hay un id de plantilla
    });
    const form = useForm<z.infer<typeof plantillaSchema>>({
        resolver: zodResolver(plantillaSchema),
        defaultValues: {
            descripcion: '',
            tareas: addedTasks,
        },
    });

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: { descripcion: string; tareas: number[] }) => createPlantilla(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plantillas'] });
            toast.success('Plantilla creada exitosamente');
            setIsOpen(false);
        },
        onError: (error) => {
            toast.error('Error al crear la plantilla');
            console.error('Error de creación de la plantilla:', error);
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: { descripcion: string; tareas: number[] }) => updatePlantilla(plantillaId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['plantillas'] });
            toast.success('Plantilla actualizada exitosamente');
            setIsOpen(false);
        },
        onError: (error) => {
            toast.error('Error al actualizar la plantilla');
            console.error('Error de actualización de la plantilla:', error);
        },
    });

    const handleAddTask = () => {
        const taskToAdd = tareas.find(task => task.id_tarea === selectedTaskId);
        if (taskToAdd && !addedTasks.some(task => task.id === taskToAdd.id_tarea)) {
            setAddedTasks([...addedTasks, { id: taskToAdd.id_tarea, nombre: taskToAdd.titulo }]);
            form.setValue('tareas', [...addedTasks, { id: taskToAdd.id_tarea, nombre: taskToAdd.titulo }]);
            setSelectedTaskId(null); // Limpiar selección
        }
    };

    const handleRemoveTask = (taskId: number) => {
        const updatedTasks = addedTasks.filter(task => task.id !== taskId);
        setAddedTasks(updatedTasks);
        form.setValue('tareas', updatedTasks);
    };

    const onSubmit = async (values: z.infer<typeof plantillaSchema>) => {
        const tareasIds = values.tareas ? values.tareas.map(task => task.id) : []; 
        const payload = { descripcion: values.descripcion, tareas: tareasIds };

        if (plantillaId) {
            updateMutation.mutate(payload);  // Aquí pasamos los IDs de las tareas
        } else {
            createMutation.mutate(payload);  // Aquí pasamos los IDs de las tareas
        }
    };
    useEffect(() => {
        if (plantilla) {
            form.setValue('descripcion', plantilla.descripcion);
    
            // Mapea las tareas anidadas para extraer la tarea principal y rellenar el formulario
            const mappedTasks = plantilla.tareas.map((tareaAnidada: TareaAnidada) => ({
                id: tareaAnidada.tarea.id_tarea,  // Extrae el ID de la tarea anidada
                nombre: tareaAnidada.tarea.titulo,  // Usa el título de la tarea
            }));
    
            form.setValue('tareas', mappedTasks);  // Establece las tareas en el formulario
            setAddedTasks(mappedTasks);  // Actualiza también el estado de las tareas añadidas
        }
        if(isError){
            console.error('Error fetching plantilla data: ', error)
        }
    }, [plantilla, form, isError, error]);

    if (isTareasLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
    if (error) return toast.error('Error al recuperar los datos');

    const isLoading = form.formState.isSubmitting;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                {/* Descripción */}
                <FormField
                    name="descripcion"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel htmlFor="descripcion">
                                Descripción <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    id="descripcion"
                                    placeholder="Ingrese la descripción de la plantilla"
                                    {...field}
                                    disabled={isPlantillaLoading}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="col-span-3 flex space-x-3 items-end">
                    <TaskCombobox
                        field={{ onChange: setSelectedTaskId, value: selectedTaskId }}
                        tasks={tareas}
                    />

                    <div className="flex items-center gap-1">
                        <Button onClick={handleAddTask} disabled={!selectedTaskId} className="bg-customGreen text-white" type='button'>
                            Añadir Tarea
                        </Button>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => setIsCreatingTask(true)} // Cambiar a true para mostrar el formulario de tarea
                        >
                            Crear tarea
                        </Button>
                    </div>
                </div>
                {/* Tabla temporal de tareas añadidas */}
                <div className="col-span-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tarea</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {addedTasks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-gray-500">
                                        No hay tareas seleccionadas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                addedTasks.map(task => (
                                    <TableRow key={task.id}>
                                        <TableCell>{task.nombre}</TableCell>
                                        <TableCell className="text-right">
                                            <Button className='text-red-500 rounded-md p-2 transition-all duration-75 hover:bg-neutral-100 bg-white' onClick={() => handleRemoveTask(task.id)}>
                                                <X className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* Botón de submit */}
                <div className="col-span-2 flex justify-end">
                    <Button type="submit" disabled={isLoading} className="bg-customGreen text-white hover:bg-customGreenHover">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            'Guardar Plantilla'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
