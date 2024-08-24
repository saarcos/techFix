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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { createServiceCategory, getServiceCategoryById, ServiceCategory, updateServiceCategory } from '@/api/serviceCategories';

const formSchema = z.object({
  nombreCat: z.string().min(1, 'El nombre de la categoría es necesario'),
});

interface ServiceCategoryFormProps {
  serviceCategoryId?: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsAddingCategory?: Dispatch<SetStateAction<boolean>>;
}

export default function ServiceCategoryForm({ serviceCategoryId, setIsOpen, setIsAddingCategory}: ServiceCategoryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreCat: '',
    },
  });

  const queryClient = useQueryClient();
  const { data: serviceCategory, isLoading: isServiceCategoryLoading, isError, error } = useQuery<ServiceCategory>({
    queryKey: ['serviceCategory', serviceCategoryId],
    queryFn: () => serviceCategoryId ? getServiceCategoryById(serviceCategoryId) : Promise.resolve({
      nombreCat: '',
    } as ServiceCategory),
    enabled: !!serviceCategoryId,
  });

  const updateMutation = useMutation({
    mutationFn: updateServiceCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceCategories'] });
      toast.success('Categoría de servicio actualizada exitosamente');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error al actualizar la categoría del servicio');
      console.error('Error de actualización de categoría de servicio:', error);
    },
  });

  const createMutation = useMutation({
    mutationFn: createServiceCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceCategories'] });
      toast.success('Categoría de servicio creada exitosamente');
      if (setIsAddingCategory) {
        setIsAddingCategory(false);
      }else{
          setIsOpen(false);
      }
    },
    onError: (error) => {
      toast.error('Error al crear la categoría del servicio');
      console.error('Error de creación de categoría de servicio:', error);
    },
  });

  useEffect(() => {
    if (serviceCategory) {
      form.reset({
        nombreCat: serviceCategory.nombreCat,
      });
    }
    if (isError) {
      console.error('Error fetching service category data:', error);
    }
  }, [serviceCategory, isError, error, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (serviceCategoryId) {
        updateMutation.mutate({
          id_catserv: serviceCategoryId,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <FormField
          name="nombreCat"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel htmlFor="nombreCat">
                Nombre de la Categoría <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="nombreCat"
                  placeholder="Ingrese el nombre de la categoría"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />
        <div className="col-span-2 flex justify-end">
          <Button type="submit" disabled={isLoading || isServiceCategoryLoading} className="bg-customGreen text-white hover:bg-customGreenHover">
            {isLoading || isServiceCategoryLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Categoría'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
