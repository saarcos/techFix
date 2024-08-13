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
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBrandById, createBrand, updateBrand, Brand } from '@/api/marcasService';
import { toast } from 'sonner';

const brandSchema = z.object({
  nombre: z.string().min(1, 'El nombre de la marca es requerido').max(50, 'Se aceptan máximo 50 caracteres'),
});

interface MarcaFormProps {
  brandId?: number;  // ID de la marca, opcional para edición
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function MarcaForm({ brandId, setIsOpen }: MarcaFormProps) {
  const form = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      nombre: '',
    },
  });

  const queryClient = useQueryClient();
  
  // Consultar datos de la marca si brandId está presente
  const { data: brand, isLoading: isBrandLoading, isError, error } = useQuery<Brand>({
    queryKey: ['brand', brandId],
    queryFn: () => brandId ? getBrandById(brandId) : Promise.resolve({} as Brand),
    enabled: !!brandId,
  });

  // Mutación para actualizar o crear
  const updateMutation = useMutation({
    mutationFn: updateBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Marca actualizada exitosamente');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error al actualizar la marca');
      console.error('Error de actualización de marca:', error);
    },
  });

  const createMutation = useMutation({
    mutationFn: createBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Marca creada exitosamente');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error al crear la marca');
      console.error('Error de creación de marca:', error);
    },
  });

  useEffect(() => {
    if (brand) {
      form.reset({
        nombre: brand.nombre,
      });
    }

    if (isError) {
      console.error('Error fetching brand data:', error);
    }
  }, [brand, isError, error, form]);

  const onSubmit = async (values: z.infer<typeof brandSchema>) => {
    try {
      if (brandId) {
        updateMutation.mutate({
          id_marca: brandId,
          ...values,
        });
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="nombre"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="nombre">
                Nombre de la Marca
              </FormLabel>
              <FormControl>
                <Input
                  id="nombre"
                  placeholder="Ingrese el nombre de la marca"
                  {...field}
                  disabled={isBrandLoading}
                />
              </FormControl>
              <FormMessage className="text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting || isBrandLoading} className='rounded-md bg-customGreen hover:bg-customGreenHover'>
            {form.formState.isSubmitting || isBrandLoading ? 'Guardando...' : brandId ? 'Actualizar Marca' : 'Guardar Marca'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
