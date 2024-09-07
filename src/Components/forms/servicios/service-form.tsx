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

import { ServiceCategory } from '@/api/serviceCategories';
import { Loader2 } from 'lucide-react';
import { createService, getServiceById, Service, updateService } from '@/api/servicioService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const formSchema = z.object({
  id_catserv: z.number().min(1, 'Categoría de servicio es requerida'),
  nombre: z.string().min(1, 'Nombre es requerido'),
  precio: z.number().min(0, 'El precio debe ser un número positivo'),
});

interface ServiceFormProps {
  serviceId?: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  categorias: ServiceCategory[];
  setIsAddingCategory: Dispatch<SetStateAction<boolean>>;
}

export default function ServiceForm({ serviceId, setIsOpen, categorias, setIsAddingCategory }: ServiceFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_catserv: 0,
      nombre: '',
      precio: 0,
    },
  });

  const queryClient = useQueryClient();
  const { data: service, isLoading: isServiceLoading, isError, error } = useQuery<Service>({
    queryKey: ['service', serviceId],
    queryFn: () => serviceId ? getServiceById(serviceId) : Promise.resolve({
      id_catserv: 0,
      nombre: '',
      precio: 0,
    } as Service),
    enabled: !!serviceId,
  });

  const updateMutation = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Servicio actualizado exitosamente');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error al actualizar el servicio');
      console.error('Error de actualización de servicio:', error);
    },
  });

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast.success('Servicio creado exitosamente');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error al crear el servicio');
      console.error('Error de creación de servicio:', error);
    },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        id_catserv: service.id_catserv,
        nombre: service.nombre,
        precio: service.precio,
      });
    }
    if (isError) {
      console.error('Error fetching service data:', error);
    }
  }, [service, isError, error, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (serviceId) {
        updateMutation.mutate({
          id_servicio: serviceId,
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
          name="id_catserv"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel htmlFor="id_catserv">
                Categoría de Servicio <span className="text-red-500">*</span>
              </FormLabel>
              <div className='flex items-center gap-1'>
                <FormControl>
                  <select
                    id="id_catserv"
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-customGray shadow-sm cursor-pointer"
                    {...field}
                    value={field.value.toString()}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    disabled={isServiceLoading}
                  >
                    <option value="">Seleccionar Categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id_catserv} value={categoria.id_catserv}>
                        {categoria.nombreCat}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <span>
                  <Button
                    className='rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3'
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </span>
              </div>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="nombre"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel htmlFor="nombre">
                Nombre del Servicio <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="nombre"
                  placeholder="Ingrese el nombre del servicio"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="precio"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel htmlFor="precio">
                Precio <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className='flex items-center'>
                  <span className='mr-2 text-customGray'>$</span>
                  <Input
                    id="precio"
                    type="number"
                    placeholder="Ingrese el precio del servicio"
                    {...field}
                    value={field.value || ''}  // Asegúrate de que no sea undefined
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}  // Convierte el valor a número
                  />
                </div>
              </FormControl>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />
        <div className="col-span-2 flex justify-end">
          <Button type="submit" disabled={isLoading || isServiceLoading} className="bg-customGreen text-white hover:bg-customGreenHover">
            {isLoading || isServiceLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Servicio'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
