import { Dispatch, SetStateAction, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { createTarea, getTareaById, updateTarea,  } from '@/api/tareaService';

const formSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  tiempo: z.number().min(0, 'El tiempo debe ser un número positivo'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
});

interface TareaFormProps {
  tareaId?: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsCreatingTask: Dispatch<SetStateAction<boolean>>;
}

export default function TareaForm({ tareaId, setIsOpen, setIsCreatingTask}: TareaFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: '',
      tiempo: 0,
      descripcion: '',
    },
  });

  const queryClient = useQueryClient();
  const { data: tarea, isLoading: isTareaLoading, isError, error } = useQuery({
    queryKey: ['tarea', tareaId],
    queryFn: () => (tareaId ? getTareaById(tareaId) : Promise.resolve({ titulo: '', tiempo: 0, descripcion: '' })),
    enabled: !!tareaId,
  });

  const updateMutation = useMutation({
    mutationFn: updateTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      toast.success('Tarea actualizada exitosamente');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error al actualizar la tarea');
      console.error('Error de actualización de tarea:', error);
    },
  });

  const createMutation = useMutation({
    mutationFn: createTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      toast.success('Tarea creada exitosamente');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error al crear la tarea');
      console.error('Error de creación de tarea:', error);
    },
  });

  useEffect(() => {
    if (tarea) {
      form.reset({
        titulo: tarea.titulo,
        tiempo: tarea.tiempo,
        descripcion: tarea.descripcion,
      });
    }
    if (isError) {
      console.error('Error fetching tarea data:', error);
    }
  }, [tarea, isError, error, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (tareaId) {
        updateMutation.mutate({
          id_tarea: tareaId,
          ...values,
        });
      } else {
        createMutation.mutate({
          ...values,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Título y tiempo */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            name="titulo"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel htmlFor="titulo">Título <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input id="titulo" placeholder="Ingrese el título de la tarea" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="tiempo"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel htmlFor="tiempo">Tiempo estimado</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input id="tiempo" type="number" placeholder="0" {...field} />
                    <span className="ml-2">Minutos</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Descripción */}
        <FormField
          name="descripcion"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="descripcion">Descripción</FormLabel>
              <FormControl>
                <Textarea id="descripcion" placeholder="Ingrese la descripción de la tarea" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sección de productos y servicios */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold">Productos</h2>
          <span className='text-gray-500 text-sm font-thin'> Agrega productos a la tarea</span>
          
        </div>

        {/* Mensajes de productos y servicios */}
        <div className="bg-gray-100 p-3 rounded-md">
          <p className="text-sm">Tarea sin <a href="#" className="text-blue-600 underline">productos</a> cargados</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-md">
          <p className="text-sm">Tarea sin <a href="#" className="text-blue-600 underline">servicios</a> cargados</p>
        </div>

        {/* Botones */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setIsCreatingTask(false)}>Cancelar</Button>
          <Button type="submit" disabled={isLoading || isTareaLoading} className="bg-customGreen text-white hover:bg-customGreenHover">
            {isLoading || isTareaLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
