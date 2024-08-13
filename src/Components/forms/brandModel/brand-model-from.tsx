import { Dispatch, SetStateAction } from 'react';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createBrandModel } from '@/api/brandModelService';

const brandModelSchema = z.object({
  marcaNombre: z.string().min(1, 'El nombre de la marca es requerido'),
  modeloNombre: z.string().min(1, 'El nombre del modelo es requerido'),
});

interface BrandModelFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsAddingBrand: Dispatch<SetStateAction<boolean>>;
}

export default function BrandModelForm({ setIsOpen, setIsAddingBrand }: BrandModelFormProps) {
  const form = useForm<z.infer<typeof brandModelSchema>>({
    resolver: zodResolver(brandModelSchema),
    defaultValues: {
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

  const onSubmit = async (values: z.infer<typeof brandModelSchema>) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="marcaNombre"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="marcaNombre">
                Nombre de la Marca
              </FormLabel>
              <FormControl>
                <Input
                  id="marcaNombre"
                  placeholder="Ingrese el nombre de la marca"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="modeloNombre"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="modeloNombre">
                Nombre del Modelo
              </FormLabel>
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
          <Button type="submit" disabled={form.formState.isSubmitting} className="bg-customGreen hover:bg-customGreenHover">
            {form.formState.isSubmitting ? 'Guardando...' : 'Guardar Marca y Modelo'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
