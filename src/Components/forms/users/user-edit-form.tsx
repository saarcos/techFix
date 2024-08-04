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
import { useQuery } from '@tanstack/react-query';
import { getUserById, User } from '@/api/userService';

const formSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  apellido: z.string().min(1, 'Apellido es requerido'),
  email: z.string().email('Correo inválido'),
  role: z.string().min(1, 'Rol es requerido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

interface Role {
  id_rol: number;
  nombrerol: string;
}

interface EditFormProps {
  userId: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  roles: Role[];
}

export default function EditForm({ userId, setIsOpen, roles }: EditFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      role: '',
      password: '',
    },
  });

  const { data: user, isLoading: isUserLoading, isError, error } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
  });

  useEffect(() => {
    if (user) {
      form.reset({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        role: user.id_rol.toString(),
        password: '',
      });
    }

    if (isError) {
      console.error('Error fetching user data:', error);
    }
  }, [user, isError, error, form]);

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
    console.log('Submitting values:', values);
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
                  disabled={isUserLoading}
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
                  disabled={isUserLoading}
                />
              </FormControl>
              <FormMessage className="col-span-4 text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="email" className="text-right">
                Correo
              </FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="pedro@mail.com"
                  className="col-span-3"
                  {...field}
                  disabled={isUserLoading}
                />
              </FormControl>
              <FormMessage className="col-span-4 text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="role"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="role" className="text-right">
                Rol
              </FormLabel>
              <FormControl>
                <select
                  id="role"
                  className="col-span-3 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                  {...field}
                  disabled={isUserLoading}
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((role) => (
                    <option key={role.id_rol} value={role.id_rol}>
                      {role.nombrerol}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage className="col-span-4 text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="password" className="text-right">
                Contraseña
              </FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="*********"
                  className="col-span-3"
                  {...field}
                />
              </FormControl>
              <FormMessage className="col-span-4 text-right text-sm text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={isLoading || isUserLoading} className="bg-customGreen text-white hover:bg-customGreenHover">
            {isLoading || isUserLoading ? (
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
