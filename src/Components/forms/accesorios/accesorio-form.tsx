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
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAccesorioById, updateAccesorio, createAccesorio, Accesorio } from '@/api/accesorioService';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';

// Esquema de validación usando Zod
const formSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido').max(50, 'Ingresa menos de 50 caracteres'),
});

interface AccesorioFormProps {
  accesorioId?: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function AccesorioForm({ accesorioId, setIsOpen }: AccesorioFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
    },
  });

  const queryClient = useQueryClient();

  // Consultar accesorio por ID si accesorioId está presente
  const { data: accesorio, isLoading: isAccesorioLoading, isError, error } = useQuery<Accesorio>({
    queryKey: ['accesorio', accesorioId],
    queryFn: () => accesorioId ? getAccesorioById(accesorioId) : Promise.resolve({
      id_accesorio: 0,
      nombre: '',
    } as Accesorio),
    enabled: !!accesorioId,
  });

  // Mutación para actualizar el accesorio
  const updateMutation = useMutation({
    mutationFn: updateAccesorio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accesorios'] });
      toast.success('Accesorio actualizado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar el accesorio');
      console.error('Error de actualización de accesorio:', error);
    },
  });

  // Mutación para crear un nuevo accesorio
  const createMutation = useMutation({
    mutationFn: createAccesorio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accesorios'] });
      toast.success('Accesorio creado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear el accesorio');
      console.error('Error de creación de accesorio:', error);
    },
  });

  useEffect(() => {
    if (accesorio) {
      form.reset({
        nombre: accesorio.nombre,
      });
    }

    if (isError) {
      console.error('Error fetching accesorio data:', error);
    }
  }, [accesorio, isError, error, form]);

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (accesorioId) {
        updateMutation.mutate({
          id_accesorio: accesorioId,
          ...values,
        });
      } else {
        createMutation.mutate({
          ...values,
        });
      }
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          name="nombre"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="nombre" className="text-right">
                Nombre <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span>
              </FormLabel>
              <FormControl>
                <Input
                  id="nombre"
                  placeholder="Nombre del accesorio"
                  className="col-span-3"
                  {...field}
                  disabled={isAccesorioLoading}
                />
              </FormControl>
              <FormMessage className="col-span-4 text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isLoading || isAccesorioLoading} className="bg-customGreen text-white hover:bg-customGreenHover">
            {isLoading || isAccesorioLoading ? (
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
