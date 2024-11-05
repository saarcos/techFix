import { Dispatch, SetStateAction, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Almacen, createAlmacen, getAlmacenById, updateAlmacen } from '@/api/almacenesService';
import { Loader2 } from 'lucide-react';

const almacenSchema = z.object({
  nombre: z.string().min(1, 'El nombre del almacén es requerido'),
});

interface AlmacenFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  almacenId?: number;
}

export default function AlmacenForm({ setIsOpen, almacenId }: AlmacenFormProps) {
  const form = useForm<z.infer<typeof almacenSchema>>({
    resolver: zodResolver(almacenSchema),
    defaultValues: {
      nombre: '',
    },
  });
  const { data: almacen, isLoading: isAlmacenLoading , isError, error } = useQuery<Almacen>({
    queryKey: ['almacen', almacenId],
    queryFn: () => almacenId ? getAlmacenById(almacenId) : Promise.resolve({
      nombre: '',
    } as Almacen),
    enabled: !!almacenId,
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createAlmacen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['almacenes'] });
      toast.success('Almacén creado exitosamente');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error al crear el almacén');
      console.error('Error de creación de almacén:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAlmacen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['almacenes'] });
      toast.success('Almacén actualizado exitosamente');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error al actualizar el almacén');
      console.error('Error de actualización de almacén:', error);
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof almacenSchema>) => {
    try {
      if (almacenId) {
        updateMutation.mutate({ ...values, id_almacen: almacenId });
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    if (almacen) {
      form.reset({
        nombre: almacen.nombre
      });
    }
    if (isError) {
      console.error('Error fetching almacén data:', error);
    }
  }, [almacen, isError, error, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          name="nombre"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="nombre">
                Nombre del Almacén <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="nombre"
                  placeholder="Ingrese el nombre del almacén"
                  {...field}
                  disabled={isAlmacenLoading}
                />
              </FormControl>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="bg-customGreen text-white hover:bg-customGreenHover">
            {isLoading ? (
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
