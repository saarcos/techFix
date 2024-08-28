import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { EquipoCombobox } from '@/Components/comboBoxes/equipo-combobox';
import { Equipo, getEquipos } from '@/api/equipoService';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import Spinner from '../../../assets/tube-spinner.svg';
import fileUploader from '../../../assets/icons/file-upload.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import { ClienteCombobox } from '@/Components/comboBoxes/cliente-combobox';
import { Client, getClients } from '@/api/clientService';
import { getUsers, User } from '@/api/userService';
import { TecnicoCombobox } from '@/Components/comboBoxes/tecnico-combobox';
const formSchema = z.object({
  id_equipo: z.number().min(1, 'Equipo es requerido'),
  id_usuario: z.number().min(1, 'Usuario es requerido'),
  id_cliente: z.number().min(1, 'Cliente es requerido'),
  numero_orden: z.string().min(1, 'Número de orden es requerido'),
  area: z.string().min(1, 'Área es requerida'),
  prioridad: z.string().min(1, 'Prioridad es requerida'),
  descripcion: z.string().min(1, 'Descripción es requerida'),
  estado: z.string().min(1, 'Estado es requerido'),
  password: z.string().optional(),
  fecha_prometida: z.string().optional(),
  presupuesto: z.number().optional(),
  adelanto: z.number().optional(),
  archivos: z.any().optional(), // Para manejar archivos de manera opcional
});

export default function OrdenTrabajoForm() {
  const { data: equipos = [], isLoading: isEquipoLoading, error } = useQuery<Equipo[]>({
    queryKey: ['devices'],
    queryFn: getEquipos,
  });
  const { data: clientes = [], isLoading: isClienteLoading } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: getClients,
  });
  const { data: tecnicos = [], isLoading: isTecnicoLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_equipo: 0,
      id_usuario: 0,
      id_cliente: 0,
      numero_orden: '',
      area: 'entrada',
      prioridad: 'Normal',
      descripcion: '',
      estado: 'CHEQUEO',
      password: '',
      fecha_prometida: '',
      presupuesto: undefined,
      adelanto: undefined,
      archivos: [], // Default vacío para archivos
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  if (isEquipoLoading || isClienteLoading || isTecnicoLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
  if (error) return toast.error('Error al recuperar los datos');

  const selectedArea = form.watch('area'); 

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 mt-5">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full max-w-9xl overflow-x-auto">
          <CardHeader>
            <CardTitle>Nueva Orden de Trabajo</CardTitle>
            <CardDescription>
              Crea una nueva orden de trabajo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    name="id_cliente"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span></FormLabel>
                          <div className='flex items-center gap-1'>
                          <FormControl>
                            <ClienteCombobox field={field} clientes={clientes} isClienteLoading={isClienteLoading} />
                          </FormControl>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                              <Button 
                                className='rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3'
                                type="button" 
                                >
                                <FontAwesomeIcon icon={faPlus}/> 
                              </Button>
                              </TooltipTrigger>
                              <TooltipContent className='bg-customGray text-white border-none font-semibold'>
                                <p>Añade un nuevo cliente</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="id_equipo"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipo <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span></FormLabel>
                        <div className='flex items-center gap-1'>
                        <FormControl>
                          <EquipoCombobox field={field} equipos={equipos} isEquipoLoading={isEquipoLoading} />
                        </FormControl>
                        <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                              <Button 
                                className='rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3'
                                type="button" 
                                >
                                <FontAwesomeIcon icon={faPlus}/> 
                              </Button>
                              </TooltipTrigger>
                              <TooltipContent className='bg-customGray text-white border-none font-semibold'>
                                <p>Añade un nuevo equipo</p>
                              </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="prioridad"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridad</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una prioridad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Alta">Alta</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Baja">Baja</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="area"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un área" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="entrada">Entrada</SelectItem>
                            <SelectItem value="reparacion">Reparación</SelectItem>
                            <SelectItem value="salida">Salida</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {(selectedArea === 'reparacion' || selectedArea === 'salida') && (
                    <FormField
                      name="id_usuario"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Técnico</FormLabel>
                            <FormControl>
                              <TecnicoCombobox field={field} tecnicos={tecnicos} isTecnicoLoading={isTecnicoLoading} />
                            </FormControl>
                            <FormDescription>Selecciona el técnico responsable de la orden</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    name="estado"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un estado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CHEQUEO">CHEQUEO</SelectItem>
                            <SelectItem value="REPARACION">REPARACIÓN</SelectItem>
                            <SelectItem value="TERMINADO">TERMINADO</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="fecha_prometida"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha Prometida</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP")
                                ) : (
                                  <span>Selecciona una fecha</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                field.onChange(date ? format(date, "yyyy-MM-dd") : '');
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="presupuesto"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Presupuesto</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Presupuesto" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="adelanto"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adelanto</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Adelanto" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                    name="descripcion"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trabajo <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3'/></span></FormLabel>
                        <FormControl>
                          <textarea
                            id="descripcion"
                            placeholder="Descripción"
                            className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Describe el trabajo a realizar en el equipo</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <div className="mt-4">
                  <FormLabel>Adjuntar imágenes</FormLabel>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-customGreen/50 rounded-lg p-4 bg-customGreen/5 mt-4">
                      <img 
                        src={fileUploader}
                        width={96}
                        height={77}
                        alt='file-upload'
                    />
                    <p className="text-sm text-gray-500">Arrastra aquí los archivos a cargar, o</p>
                    <Button variant="secondary" className="mt-2 bg-customGreen/30 hover:bg-customGreenHover/30">Navegar</Button>
                    <FormField
                      name="archivos"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          type="file"
                          multiple
                          {...field}
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            field.onChange(files);
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" className="mr-2">
                    Cancelar
                  </Button>
                  <Button type="submit" className='bg-customGreen hover:bg-customGreenHover'>Guardar</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
