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
import { createDeviceType, DeviceType, getDeviceTypeById, updateDeviceType } from '@/api/tipoEquipoService';

const brandSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(50, 'Se aceptan máximo 50 caracteres'),
});

interface TipoEquipoFormProps {
  deviceTypeId?: number;  // ID de la marca, opcional para edición
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsAddingTipoEquipo: Dispatch<SetStateAction<boolean>>;
}

export default function TipoEquipoForm({ deviceTypeId, setIsOpen, setIsAddingTipoEquipo}: TipoEquipoFormProps) {
  const form = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      nombre: '',
    },
  });

  const queryClient = useQueryClient();
  
  // Consultar datos de la tipo de equipo si deviceTypeId está presente
  const { data: tipoEquipo, isLoading: isDeviceTypeLoading, isError, error } = useQuery<DeviceType>({
    queryKey: ['deviceType', deviceTypeId],
    queryFn: () => deviceTypeId ? getDeviceTypeById(deviceTypeId) : Promise.resolve({} as DeviceType),
    enabled: !!deviceTypeId,
  });

  // Mutación para actualizar o crear
  const updateMutation = useMutation({
    mutationFn: updateDeviceType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceTypes'] });
      toast.success('Tipo de equipo actualizado exitosamente');
      setIsAddingTipoEquipo(false);
    },
    onError: (error) => {
      toast.error('Error al actualizar el tipo de equipo');
      setIsOpen(false);
      setIsAddingTipoEquipo(false);
      console.error('Error de actualización del tipo de equipo:', error);
    },
  });

  const createMutation = useMutation({
    mutationFn: createDeviceType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deviceTypes'] });
      toast.success('Tipo de equipo creado exitosamente');
      setIsAddingTipoEquipo(false);
    },
    onError: (error) => {
      toast.error('Error al crear el tipo de equipó');
      setIsOpen(false);
      setIsAddingTipoEquipo(false);
      console.error('Error de creación del tipo de equipo:', error);
    },
  });

  useEffect(() => {
    if (tipoEquipo) {
      form.reset({
        nombre: tipoEquipo.nombre,
      });
    }
    if (isError) {
      console.error('Error fetching brand data:', error);
    }
  }, [tipoEquipo, isError, error, form]);

  const onSubmit = async (values: z.infer<typeof brandSchema>) => {
    try {
      if (deviceTypeId) {
        updateMutation.mutate({
          id_tipoe: deviceTypeId,
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
                Nombre del tipo de equipo
              </FormLabel>
              <FormControl>
                <Input
                  id="nombre"
                  placeholder="Ingrese el nombre del tipo de equipo"
                  {...field}
                  disabled={isDeviceTypeLoading}
                />
              </FormControl>
              <FormMessage className="text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting || isDeviceTypeLoading} className='rounded-md bg-customGreen hover:bg-customGreenHover'>
            {form.formState.isSubmitting || isDeviceTypeLoading ? 'Guardando...' : deviceTypeId ? 'Actualizar tipo de equipo' : 'Guardar tipo de equipo'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
