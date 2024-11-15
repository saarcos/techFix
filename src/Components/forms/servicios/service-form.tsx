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
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createService, getServiceById, Service, updateService } from '@/api/servicioService';
import { Loader2 } from 'lucide-react';
import { ServiceCategory } from '@/api/serviceCategories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const serviceSchema = z.object({
  id_catserv: z.number().min(1, 'Categoría de servicio es requerida'),
  nombre: z.string().min(1, 'Nombre es requerido'),
  preciosiniva: z.preprocess(
    (value) => parseFloat(value as string),
    z.number().min(1, 'El precio debe ser un número positivo mayor que cero')
  ),
  iva: z.number().min(0, 'IVA es requerido'),
  preciofinal: z.number(),
});

interface ServiceFormProps {
  serviceId?: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  categorias: ServiceCategory[];
  setIsAddingCategory: Dispatch<SetStateAction<boolean>>;
}

export default function ServiceForm({ serviceId, setIsOpen, categorias, setIsAddingCategory }: ServiceFormProps) {
  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      id_catserv: 0,
      nombre: '',
      preciosiniva: 0,
      iva: 12,
      preciofinal: 0,
    },
  });

  const queryClient = useQueryClient();
  const { data: service, isLoading: isServiceLoading, isError, error } = useQuery<Service>({
    queryKey: ['service', serviceId],
    queryFn: () => serviceId ? getServiceById(serviceId) : Promise.resolve({
      id_catserv: 0,
      nombre: '',
      preciosiniva: 0,
      iva: 12,
      preciofinal: 0,
    } as Service),
    enabled: !!serviceId,
  });
  const preciosiniva = useWatch({ control: form.control, name: 'preciosiniva' });
  const iva = useWatch({ control: form.control, name: 'iva' });

  useEffect(() => {
    if (service) {
      form.reset({
        id_catserv: service.id_catserv,
        nombre: service.nombre,
        preciosiniva: service.preciosiniva,  
        iva: service.iva,  
        preciofinal: service.preciofinal,  
      });
    }
    if (isError) {
      console.error('Error fetching service data:', error);
    }
  }, [service, isError, error, form]);

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

 
  useEffect(() => {
    const preciosinivaNum = typeof preciosiniva === 'number' ? preciosiniva : parseFloat(preciosiniva) || 0;
    const ivaNum = typeof iva === 'number' ? iva : parseFloat(iva) || 0;

    if (preciosinivaNum > 0 || ivaNum >= 0) {
      const nuevoPrecioFinal = preciosinivaNum + (preciosinivaNum * (ivaNum / 100));
      form.setValue('preciofinal', parseFloat(nuevoPrecioFinal.toFixed(2)));
    }
  }, [preciosiniva, iva, form]);
  const handleBlur = () => {
    const currentPrice = form.getValues('preciosiniva');
    if (!currentPrice || isNaN(currentPrice) || currentPrice < 0) {
        form.setValue('preciosiniva', 1);
    }
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof serviceSchema>) => {
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
        {/* Campo de categoría de servicio */}
        <FormField
          name="id_catserv"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel htmlFor="id_catserv">
                Categoría de Servicio <span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex items-center gap-1">
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
                <Button
                  className="rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3"
                  type="button"
                  onClick={() => setIsAddingCategory(true)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />

        {/* Nombre del servicio */}
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
        <div className='col-span-2'>
          <h2 className="text-lg font-semibold mb-4">Datos económicos</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="preciosiniva"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel htmlFor="preciosiniva">
                    Precio sin IVA <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="mr-2 text-customGray">$</span>
                      <Input
                        id="preciosiniva"
                        type="number"
                        placeholder="Ingrese el precio sin IVA"
                        {...field}
                        value={field.value || ""}
                        onBlur={handleBlur}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-left text-sm text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              name="iva"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel htmlFor="iva">
                    IVA (%) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <select
                      id="iva"
                      className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-customGray shadow-sm cursor-pointer"
                      {...field}
                      value={field.value.toString()}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      disabled={isServiceLoading}
                    >
                      <option value="0">0%</option>
                      <option value="10">10%</option>
                      <option value="12">12%</option>
                      <option value="15">15%</option>
                      <option value="21">21%</option>
                      <option value="27">27%</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-left text-sm text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              name="preciofinal"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel htmlFor="preciofinal">
                    Precio Final <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div
                      className={`flex items-center ${field.value > 0 ? "text-black" : "text-gray-400"
                        }`}
                    >
                      <span className={`mr-2 ${field.value > 0 ? "text-black" : "text-gray-400"}`}>$</span>
                      <Input
                        id="preciofinal"
                        type="number"
                        value={field.value}
                        readOnly
                        className={field.value > 0 ? "text-black" : "text-gray-400"}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-left text-sm text-red-500" />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* Botón para guardar el servicio */}
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
