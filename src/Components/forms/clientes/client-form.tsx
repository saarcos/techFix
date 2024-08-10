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
import { getClientById, updateCliente, createCliente, Client } from '@/api/clientService';
import { toast } from 'sonner';

const formSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido').max(50, 'Ingresa menos de 50 caracteres'),
  apellido: z.string().min(1, 'Apellido es requerido').max(100, 'Ingresa menos de 50 caracteres'),
  cedula: z.string()
  .regex(/^\d+$/, { message: 'La cédula solo puede contener números' })
  .refine((val) => val.length === 10 || val.length === 13, {
    message: 'Cédula inválida, debe tener 10 o 13 caracteres',
  }), 
  correo: z.string().email('Correo inválido'),
  celular: z.string().min(10, 'Número telefónico inválido').max(10,'Número telefónico inválido'),
  tipo_cliente: z.string().min(1, 'Tipo de cliente es requerido'),
});

interface UserFormProps {
  clienteId?: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function UserForm({ clienteId, setIsOpen }: UserFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      cedula: '',
      correo: '',
      celular: '',
      tipo_cliente: '',
    },
  });

  const queryClient = useQueryClient();
  const { data: cliente, isLoading: isClienteLoading, isError, error } = useQuery<Client>({
    queryKey: ['cliente', clienteId],
    queryFn: () => clienteId ? getClientById(clienteId) : Promise.resolve({
      id_cliente: 0,
      nombre: '',
      apellido: '',
      cedula: '',
      correo: '',
      celular: '',
      tipo_cliente: ''
    } as Client),
    enabled: !!clienteId,
  });

  const updateMutation = useMutation({
    mutationFn: updateCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente actualizado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar el cliente');
      console.error('Error de actualización de cliente:', error);
    },
  });

  const createMutation = useMutation({
    mutationFn: createCliente,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente creado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al crear el cliente');
      console.error('Error de creación de cliente:', error);
    },
  });

  useEffect(() => {
    if (cliente) {
      form.reset({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        cedula: cliente.cedula,
        correo: cliente.correo,
        celular: cliente.celular,
        tipo_cliente: cliente.tipo_cliente,
      });
    }

    if (isError) {
      console.error('Error fetching cliente data:', error);
    }
  }, [cliente, isError, error, form]);

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (clienteId) {
        updateMutation.mutate({
          id_cliente: clienteId,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          name="nombre"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="nombre" className="text-right">
                Nombre
              </FormLabel>
              <FormControl>
                <Input
                  id="nombre"
                  placeholder="Pedro"
                  className="col-span-3"
                  {...field}
                  disabled={isClienteLoading}
                />
              </FormControl>
              <FormMessage className="col-span-4 text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="apellido"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="apellido" className="text-right">
                Apellido
              </FormLabel>
              <FormControl>
                <Input
                  id="apellido"
                  placeholder="Duarte"
                  className="col-span-3"
                  {...field}
                  disabled={isClienteLoading}
                />
              </FormControl>
              <FormMessage className="col-span-4 text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="cedula"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="cedula" className="text-right">
                Cédula
              </FormLabel>
              <FormControl>
                <Input
                  id="cedula"
                  placeholder="1751200713"
                  className="col-span-3"
                  maxLength={13}
                  {...field}
                  disabled={isClienteLoading}
                />
              </FormControl>
              <FormMessage className="col-span-4 text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="correo"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="correo" className="text-right">
                Correo
              </FormLabel>
              <FormControl>
                <Input
                  id="correo"
                  type="email"
                  placeholder="pedro@mail.com"
                  className="col-span-3"
                  {...field}
                  disabled={isClienteLoading}
                />
              </FormControl>
              <FormMessage className="col-span-4 text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="celular"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="celular" className="text-right">
                Celular
              </FormLabel>
              <FormControl>
                <Input
                  id="celular"
                  placeholder="1234567890"
                  className="col-span-3"
                  maxLength={10}
                  {...field}
                  disabled={isClienteLoading}
                />
              </FormControl>
              <FormMessage className="col-span-4 text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="tipo_cliente"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="tipo_cliente" className="text-right">
                Tipo
              </FormLabel>
              <FormControl>
                <select
                  id="tipo_cliente"
                  className="col-span-3 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                  {...field}
                  disabled={isClienteLoading}
                >
                  <option value="">Seleccione un tipo</option>
                  <option value="Persona">Persona</option>
                  <option value="Empresa">Empresa</option>
                </select>
              </FormControl>
              <FormMessage className="col-span-4 text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isLoading || isClienteLoading} className="bg-customGreen text-white hover:bg-customGreenHover">
            {isLoading || isClienteLoading ? (
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
