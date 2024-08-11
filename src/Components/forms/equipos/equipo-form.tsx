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
import { getEquipoById, updateEquipo, createEquipo, Equipo } from '@/api/equipoService';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Brand } from '@/api/marcasService';
import { Model } from '@/api/modeloService';
import { Client } from '@/api/clientService';
import { DeviceType } from '@/api/tipoEquipoService';

const formSchema = z.object({
  id_cliente: z.number().min(1, 'ID de cliente es requerido'),
  id_tipoe: z.number().min(1, 'ID de tipo es requerido'),
  id_marca: z.number().min(1, 'ID de marca es requerido'),
  id_modelo: z.number().min(1, 'ID de modelo es requerido'),
  nserie: z.string()
    .regex(/^[A-Z0-9-]{8,20}$/, "Número de serie inválido")
    .min(8, "El número de serie es demasiado corto")
    .max(20, "El número de serie es demasiado largo"),
  descripcion: z.string(),
});

interface EquipoFormProps {
  equipoId?: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  brands: Brand[];
  models: Model[];
  owners: Client[];
  deviceTypes: DeviceType[];
}

export default function EquipoForm({ equipoId, setIsOpen, brands, models, owners, deviceTypes}: EquipoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_cliente: 0,
      id_tipoe: 0,
      id_marca: 0,
      id_modelo: 0,
      nserie: '',
      descripcion: '',
    },
  });

  const queryClient = useQueryClient();
  const { data: equipo, isLoading: isEquipoLoading, isError, error } = useQuery<Equipo>({
    queryKey: ['equipo', equipoId],
    queryFn: () => equipoId ? getEquipoById(equipoId) : Promise.resolve({
      id_cliente: 0,
      id_tipoe: 0,
      id_marca: 0,
      id_modelo: 0,
      nserie: '',
      descripcion: '',
    } as Equipo),
    enabled: !!equipoId,
  });

  const updateMutation = useMutation({
    mutationFn: updateEquipo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Equipo actualizado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar el equipo');
      console.error('Error de actualización de equipo:', error);
    },
  });

  const createMutation = useMutation({
    mutationFn: createEquipo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast.success('Equipo creado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear el equipo');
      console.error('Error de creación de equipo:', error);
    },
  });

  useEffect(() => {
    if (equipo) {
      form.reset({
        id_cliente: equipo.id_cliente,
        id_marca: equipo.id_marca,
        id_modelo: equipo.id_modelo,
        nserie: equipo.nserie,
        descripcion: equipo.descripcion,
      });
    }

    if (isError) {
      console.error('Error fetching equipo data:', error);
    }
  }, [equipo, isError, error, form]);

  const generateSerialNumber = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let serial = '';
    for (let i = 0; i < 15; i++) {
      serial += chars[Math.floor(Math.random() * chars.length)];
    }
    form.setValue('nserie', serial); 
  };

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (equipoId) {
        updateMutation.mutate({
          id_equipo: equipoId,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <FormField
          name="id_marca"
          control={form.control}
          render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel htmlFor="id_marca" className='items-center text-center'>
              Marca <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span>
            </FormLabel>
            <div className="flex items-center gap-1">
              <FormControl>
              <select
                id="id_marca"
                className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-customGray shadow-sm cursor-pointer"
                {...field}
                value={field.value.toString()} // Convierte el valor a string para mostrar en el select
                onChange={(e) => field.onChange(parseInt(e.target.value, 10))} // Convierte el valor de vuelta a número al seleccionar
                disabled={isEquipoLoading}
              >
                <option value="">Seleccionar Marca</option>
                {brands.map((brand) => (
                  <option key={brand.id_marca} value={brand.id_marca}>
                    {brand.nombre}
                  </option>
                ))}
              </select>
              </FormControl>
              <Button className='rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3'><FontAwesomeIcon icon={faPlus}/> </Button>
            </div>
            <FormMessage className="text-right text-sm text-red-500" />
          </FormItem>
          )}
        />
        <FormField
          name="id_modelo"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel htmlFor="id_modelo">
                Modelo <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span>
              </FormLabel>
              <div className="flex items-center gap-1">
                <FormControl>
                  <select
                    id="id_modelo"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                    {...field}
                    value={field.value.toString()} // Convierte el valor a string para mostrar en el select
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))} // Convierte el valor de vuelta a número al seleccionar
                    disabled={isEquipoLoading}
                  >
                    <option value="">Seleccionar Modelo</option>
                    {models.map((model)=>(
                      <option key={model.id_modelo} value={model.id_modelo}>{model.nombre}</option>
                    ))}
                  </select>
                </FormControl>
                <Button className='rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3'><FontAwesomeIcon icon={faPlus}/> </Button>
              </div>
              <FormMessage className="text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="id_tipoe"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel htmlFor="id_tipoe">
                Tipo <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span>
              </FormLabel>
              <div className="flex items-center gap-1">
                <FormControl>
                  <select
                    id="id_tipoe"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                    {...field}
                    value={field.value.toString()} // Convierte el valor a string para mostrar en el select
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))} // Convierte el valor de vuelta a número al seleccionar
                    disabled={isEquipoLoading}
                  >
                    <option value="">Seleccionar Tipo</option>
                    {deviceTypes.map((tipo)=>(
                      <option key={tipo.id_tipoe} value={tipo.id_tipoe}>{tipo.nombre}</option>
                    ))}
                  </select>
                </FormControl>
                <Button className='rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3'><FontAwesomeIcon icon={faPlus}/> </Button>
              </div>
              <FormMessage className="text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="id_cliente"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel htmlFor="id_cliente">
                Propietario <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span>
              </FormLabel>
              <div className="flex items-center gap-1">
                <FormControl>
                  <select
                    id="id_cliente"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                    {...field}
                    value={field.value.toString()} // Convierte el valor a string para mostrar en el select
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))} // Convierte el valor de vuelta a número al seleccionar
                    disabled={isEquipoLoading}
                  >
                    <option value="">Seleccionar Propietario</option>
                    {owners.map((owner)=>(
                      <option key={owner.id_cliente} value={owner.id_cliente}>{owner.nombre} {owner.apellido}</option>
                    ))}
                  </select>
                </FormControl>
              </div>
              <FormMessage className="text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="nserie"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel htmlFor="nserie">
                N° Serie <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span>
              </FormLabel>
              <div className="flex items-center gap-1">
                <FormControl>
                  <Input
                    id="nserie"
                    placeholder="N° Serie"
                    {...field}
                    value={field.value.toString()} // Convierte el valor a string para mostrar en el select
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))} // Convierte el valor de vuelta a número al seleccionar
                    disabled={isEquipoLoading}
                  />
                </FormControl>
                <Button
                  type="button"
                  onClick={generateSerialNumber}
                  className="rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3"
                >
                  Generar aleatorio
                </Button>
              </div>
              <FormMessage className="text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="descripcion"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel htmlFor="descripcion">
                Descripción/Observaciones <span className='text-sm font-extralight text-gray-400 '>(opcional)</span>
              </FormLabel>
              <FormControl>
                <textarea
                  id="descripcion"
                  placeholder="Descripción"
                  className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...field}
                  disabled={isEquipoLoading}
                />
              </FormControl>
              <FormMessage className="text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <div className="col-span-2 flex justify-end">
          <Button type="submit" disabled={isLoading || isEquipoLoading} className="bg-customGreen text-white hover:bg-customGreenHover">
            {isLoading || isEquipoLoading ? (
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
