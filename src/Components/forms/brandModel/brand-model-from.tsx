import { Dispatch, SetStateAction, useState } from 'react';
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
import { createBrandModel } from '@/api/brandModelService';
import { Brand, getBrands } from '@/api/marcasService';
import { createModel } from '@/api/modeloService';

const brandModelSchema = z.object({
  marcaId: z.string().optional(),  
  marcaNombre: z.string().optional(), 
  modeloNombre: z.string().min(1, 'El nombre del modelo es requerido'),
});

interface BrandModelFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsAddingBrand: Dispatch<SetStateAction<boolean>>;
}

export default function BrandModelForm({ setIsOpen, setIsAddingBrand }: BrandModelFormProps) {
  const [isCreatingBrand, setIsCreatingBrand] = useState(false);  // Estado para manejar si estamos creando una nueva marca
  const {data: marcas=[],  isLoadingError: marcasError} = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: getBrands,
  });
  const form = useForm<z.infer<typeof brandModelSchema>>({
    resolver: zodResolver(brandModelSchema),
    defaultValues: {
      marcaId: '',
      marcaNombre: '',
      modeloNombre: '',
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
     mutationFn: createBrandModel,
     onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['brands'] });
        queryClient.invalidateQueries({ queryKey: ['models'] });
        toast.success('Marca y modelo creados exitosamente');
        setIsAddingBrand(false);
      },
      onError: (error) => {
        toast.error('Error durante la creación de marca y modelo');
        setIsAddingBrand(false);
        setIsOpen(false);
        console.error('Error creación:', error);
      },
  });
  const onlyModelMutation= useMutation({
    mutationFn: createModel,
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: ['models'] });
      toast.success('Marca y modelo creados exitosamente');
      setIsAddingBrand(false);
    },
    onError: (error) => {
      toast.error('Error durante la creación de marca y modelo');
      setIsAddingBrand(false);
      setIsOpen(false);
      console.error('Error creación:', error);
    },
  })

  const onSubmit = async (values: z.infer<typeof brandModelSchema>) => {
    if (isCreatingBrand) {
      // Crear un objeto con solo los campos necesarios para la creación de marca y modelo
      const payload = {
        marcaNombre: values.marcaNombre!,
        modeloNombre: values.modeloNombre,
      };
      mutation.mutate(payload);
    } else {
      // Solo se está creando un modelo para una marca existente
      onlyModelMutation.mutate({
        nombre: values.modeloNombre,
        id_marca: parseInt(values.marcaId!, 10),  // Convertir marcaId a número
      });
    }
  };
  if (marcasError ) return toast.error('Error al recuperar los datos');

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {!isCreatingBrand ? (
        <FormField
          name="marcaId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="marcaId">Marca</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <select
                    id="marcaId"
                    className="w-full p-2 border rounded"
                    {...field}
                  >
                    <option value="">Selecciona una marca</option>
                    {marcas.map((marca) => (
                      <option key={marca.id_marca} value={marca.id_marca.toString()}>
                        {marca.nombre}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.resetField('marcaId');
                    setIsCreatingBrand(true);
                  }}
                >
                  Crear Nueva Marca
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          name="marcaNombre"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="marcaNombre">Nombre de la Marca</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    id="marcaNombre"
                    placeholder="Ingrese el nombre de la marca"
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreatingBrand(false)}
                >
                  Usar Marca Existente
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        name="modeloNombre"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="modeloNombre">Nombre del Modelo</FormLabel>
            <FormControl>
              <Input
                id="modeloNombre"
                placeholder="Ingrese el nombre del modelo"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="bg-customGreen hover:bg-customGreenHover"
        >
          {form.formState.isSubmitting ? 'Guardando...' : `Guardar ${!isCreatingBrand ? "modelo":"marca y modelo"}`}
        </Button>
      </div>
    </form>
  </Form>
  );
}
