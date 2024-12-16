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
import { toast } from 'sonner';
import { createModel, getModelById, Model, updateModel } from '@/api/modeloService';
import { Brand, getBrands } from '@/api/marcasService';

const brandSchema = z.object({
  id_marca: z.number().min(1, 'Es necesario seleccionar una marca por cada modelo'),
  nombre: z.string().min(1, 'El nombre de la marca es requerido').max(50, 'Se aceptan máximo 50 caracteres'),
});

interface ModelFormProps {
  modelId?: number;  // ID de la marca, opcional para edición
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ModelForm({ modelId, setIsOpen }: ModelFormProps) {
  const form = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      id_marca: 0,
      nombre: '',
    },
  });

  const queryClient = useQueryClient();

  // Consultar datos de la marca si brandId está presente
  const { data: model, isLoading: isBrandLoading, isError, error } = useQuery<Model>({
    queryKey: ['models', modelId],
    queryFn: () => modelId ? getModelById(modelId) : Promise.resolve({} as Model),
    enabled: !!modelId,
  });
  const { data: marcas = [] } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: getBrands,
  });

  // Mutación para actualizar o crear
  const updateMutation = useMutation({
    mutationFn: updateModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
      toast.success('Modelo actualizado exitosamente');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error al actualizar el modelo');
      console.error('Error de actualización de modelo:', error);
    },
  });

  const createMutation = useMutation({
    mutationFn: createModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
      toast.success('Modelo creado exitosamente');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error al crear el modelo');
      console.error('Error de creación del modelo:', error);
    },
  });

  useEffect(() => {
    if (model) {
      form.reset({
        nombre: model.nombre,
        id_marca: model.id_marca,
      });
      console.log(model)
    }

    if (isError) {
      console.error('Error fetching brand data:', error);
    }
  }, [model, isError, error, form]);

  const onSubmit = async (values: z.infer<typeof brandSchema>) => {
    try {
      if (model) {
        updateMutation.mutate({
          id_modelo: model.id_modelo,
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
          name="id_marca"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="id_marca">Marca</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <select
                    id="id_marca"
                    className="w-full p-2 border rounded"
                    value={field.value} // Asegura que el valor se sincroniza con react-hook-form
                    onChange={(e) => field.onChange(Number(e.target.value))} // Convierte el valor a número
                  >
                    <option value="">Selecciona una marca</option>
                    {marcas.map((marca) => (
                      <option key={marca.id_marca} value={marca.id_marca}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
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
            {form.formState.isSubmitting || isBrandLoading ? 'Guardando...' : modelId ? 'Actualizar Marca' : 'Guardar Marca'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
