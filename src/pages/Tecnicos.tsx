import {  useRef } from 'react';
import Spinner from '../assets/tube-spinner.svg';
import { toast } from 'sonner';
import { createUsuario, getUsers, User } from '@/api/userService';
import { DataTable } from '@/Components/data-table';
import { Button } from '@/Components/ui/button';
import {columns} from '../tables/usuarios/columns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from '@/Components/ui/input';
import { Label } from "@/Components/ui/label"
import { 
  PlusCircle,
} from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getRoles, Role } from '@/api/roleService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk } from '@fortawesome/free-solid-svg-icons';

const Tecnicos = () => {
  const queryClient = useQueryClient();
  const dialogRef = useRef<HTMLButtonElement>(null);

  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  const { data: roles = [], isError: rolesError } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: getRoles,
  });
  const mutation = useMutation({
    mutationFn: createUsuario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado exitosamente');
      if (dialogRef.current) {
        dialogRef.current.click();
      }
    },
    onError: (error) => {
      toast.error('Error al crear el usuario');
      console.error('Error de creación de usuario:', error);
    },
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      role: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Correo electrónico inválido')
        .required('El correo es obligatorio'),
      password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es obligatoria'),
      nombre: Yup.string().required('El nombre es obligatorio'),
      apellido: Yup.string().required('El apellido es obligatorio'),
      role: Yup.string().required('El rol es obligatorio'),
    }),
    onSubmit: async (values, { resetForm }) => {
      mutation.mutate({
        nombre: values.nombre,
        apellido: values.apellido,
        email: values.email,
        password_hash: values.password,
        id_rol: parseInt(values.role, 10),
      });
      resetForm();
    },
  });

  if (isLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
  if (error || rolesError) return toast.error('Error al recuperar los datos');

  return (
    <div className="flex w-full flex-col bg-muted/40 mt-5">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full max-w-9xl overflow-x-auto">
          <CardHeader>
            <CardTitle>Usuarios del sistema</CardTitle>
            <CardDescription>
              Administra quién tiene acceso al sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
          <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  type='button'
                  className="h-8 gap-1 bg-customGreen hover:bg-customGreenHover"
                  ref={dialogRef}
                >
                  <PlusCircle className="h-3.5 w-3.5 text-black" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-black">
                    Nuevo usuario
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Creación de usuarios</DialogTitle>
                  <DialogDescription>
                    Crea un nuevo usuario para el sistema
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nombre" className="text-right">
                      Nombre <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span>
                    </Label>
                    <Input
                      id="nombre"
                      placeholder="Pedro"
                      className="col-span-3"
                      {...formik.getFieldProps('nombre')}
                    />
                    {formik.touched.nombre && formik.errors.nombre ? (
                      <div className="text-red-500 col-span-4 text-right text-sm">{formik.errors.nombre}</div>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="apellido" className="text-right">
                      Apellido <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span>
                    </Label>
                    <Input
                      id="apellido"
                      placeholder="Duarte"
                      className="col-span-3"
                      {...formik.getFieldProps('apellido')}
                    />
                    {formik.touched.apellido && formik.errors.apellido ? (
                      <div className="text-red-500 col-span-4 text-right text-sm">{formik.errors.apellido}</div>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Correo <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="pedro@mail.com"
                      className="col-span-3"
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-500 col-span-4 text-right text-sm">{formik.errors.email}</div>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      Rol <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span>
                    </Label>
                    <select
                      id="role"
                      className="col-span-3 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                      {...formik.getFieldProps('role')}
                    >
                      <option value="">Seleccione un rol</option>
                      {roles &&
                        roles.map((role) => (
                          <option key={role.id_rol} value={role.id_rol}>
                            {role.nombrerol}
                          </option>
                        ))}
                    </select>
                    {formik.touched.role && formik.errors.role ? (
                      <div className="text-red-500 col-span-4 text-right text-sm">{formik.errors.role}</div>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right flex items-center justify-end">
                      Contraseña <span className="text-red-500 ml-1"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="*********"
                      className="col-span-3"
                      {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="text-red-500 col-span-4 text-right text-sm">{formik.errors.password}</div>
                    ) : null}
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" className="bg-customGreen text-white hover:bg-customGreenHover">
                      Guardar
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          <DataTable data={users ?? []} columns={columns} globalFilterColumn='nombre' />
        </CardContent>  
        </Card>
        </main>
    </div>
  );
};

export default Tecnicos;
