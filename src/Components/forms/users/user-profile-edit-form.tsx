import { Dispatch, SetStateAction, useEffect, useState } from 'react';
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
import { getUserById, updateUsuariobyTecnico, User } from '@/api/userService';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';

const formSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido'),
  apellido: z.string().min(1, 'Apellido es requerido'),
  email: z.string().email('Correo inválido'),
  password_hash: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

interface EditFormProps {
  userId: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditFormTecnicos({ userId, setIsOpen }: EditFormProps) {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isMatching, setIsMatching] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      password_hash: '',
    },
  });

  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading, isError, error } = useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
  });

  const mutation = useMutation({
    mutationFn: updateUsuariobyTecnico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario actualizado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar el usuario');
      console.error('Error de actualización de usuario:', error);
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        password_hash: '',
      });
    }

    if (isError) {
      console.error('Error fetching user data:', error);
    }
  }, [user, isError, error, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isMatching) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    try {
      console.log('Submitting values:', values);
      mutation.mutate({
        id_usuario: userId,
        nombre: values.nombre,
        apellido: values.apellido,
        email: values.email,
        password_hash: values.password_hash,
      });
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setIsMatching(value === form.getValues('password_hash'));
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
                Nombre <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className="w-3 h-3" /></span>
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
                Apellido <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className="w-3 h-3" /></span>
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
                Correo <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className="w-3 h-3" /></span>
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
          name="password_hash"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel htmlFor="password" className="text-right flex items-center justify-end">
                Contraseña <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className="w-2 h-3 ml-1" /></span>
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

        <FormItem className="grid grid-cols-4 items-center gap-4">
            <FormLabel htmlFor="password" className="text-right flex items-center justify-end">
                Confirmar Contraseña <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className="w-2 h-3 ml-1" /></span>
            </FormLabel>
          <FormControl>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="*********"
              className={`col-span-3 ${isMatching ? '' : 'border-red-500'}`}
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            />
          </FormControl>
          {!isMatching && (
            <p className="col-span-4 text-right text-sm text-red-500">
              Las contraseñas no coinciden.
            </p>
          )}
        </FormItem>

        <div className="flex justify-end mt-4">
          <Button
            type="submit"
            disabled={isLoading || isUserLoading}
            className="bg-customGreen text-white hover:bg-customGreenHover"
          >
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
