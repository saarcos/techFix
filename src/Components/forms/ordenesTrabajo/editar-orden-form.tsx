import { useNavigate, useParams } from 'react-router-dom'; // Asegúrate de tener el hook de react-router-dom
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { ClienteCombobox } from '@/Components/comboBoxes/cliente-combobox';
import { getOrdenTrabajoById, OrdenTrabajoUpdate, updateOrdenTrabajo } from '@/api/ordenTrabajoService'; // Importa correctamente tus servicios
import { uploadImage } from '@/lib/firebase'; // Asegúrate de importar la función correcta
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { getClients } from '@/api/clientService';
import { EquipoCombobox } from '@/Components/comboBoxes/equipo-combobox';
import { Equipo, getEquipos } from '@/api/equipoService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { TecnicoCombobox } from '@/Components/comboBoxes/tecnico-combobox';
import { getUsers, User } from '@/api/userService';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, CreditCard, Info, Loader2, Mail, MonitorSmartphone, Phone } from 'lucide-react';
import { Calendar } from '@/Components/ui/calendar';
import { es } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import ProductServiceTableShadCN from '@/tables/productosyservicios/ProductsServicesTable';
import OrdenTrabajoTabs from '@/Components/OrdenTrabajoTabs';



const formSchema = z.object({
    id_equipo: z.number().min(1, 'Equipo es requerido'),
    id_usuario: z.number().optional(),
    id_cliente: z.number().min(1, 'Cliente es requerido'),
    area: z.string().min(1, 'Área es requerida'),
    prioridad: z.string().min(1, 'Prioridad es requerida'),
    descripcion: z.string().min(1, 'Descripción es requerida'),
    estado: z.string().min(1, 'Estado es requerido'),
    passwordequipo: z.string().optional(),
    fecha_prometida: z
        .union([z.date(), z.null()])
        .optional()
        .transform((date) => (date ? date.toISOString().split('T')[0] : null)),
    presupuesto: z
        .string()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .optional(),
    adelanto: z
        .string()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .optional(),
    archivos: z.any().optional(),
});

export default function OrdenTrabajoEditForm() {
    const { id } = useParams(); // Obtener el id desde la URL
    const id_orden = id ? parseInt(id, 10) : null; // Asegúrate de que id no sea undefined antes de convertirlo
    const queryClient = useQueryClient();
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedClient, setSelectedClient] = useState(0);
    const navigate = useNavigate();
    const { data: clientes = [], isLoading: isClientesLoading } = useQuery({
        queryKey: ['clients'],
        queryFn: getClients,
    });
    const { data: equipos = [], isLoading: isEquiposLoading } = useQuery<Equipo[]>({
        queryKey: ['devices'],
        queryFn: getEquipos,
    });
    const { data: tecnicos = [], isLoading: isTecnicosLoading } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: getUsers,
    });


    // Consulta para obtener los datos de la orden de trabajo por ID
    const { data: ordenTrabajo, isLoading, isError } = useQuery({
        queryKey: ['ordenTrabajo', id_orden],
        queryFn: () => id_orden ? getOrdenTrabajoById(id_orden) : Promise.resolve(null),
        enabled: !!id_orden,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id_equipo: 0,
            id_usuario: 0,
            id_cliente: 0,
            area: 'entrada',
            prioridad: 'Normal',
            descripcion: '',
            estado: 'CHEQUEO',
            passwordequipo: '',
            fecha_prometida: null,
            presupuesto: undefined,
            adelanto: undefined,
            archivos: [],
        },
    });

    // UseEffect para resetear el formulario cuando los datos de la orden están disponibles
    useEffect(() => {
        console.log(selectedClient)
        if (ordenTrabajo) {
            console.log("Fecha prometideush:", ordenTrabajo.fecha_prometida ? new Date(ordenTrabajo.fecha_prometida).toISOString().split('T')[0] : null)
            form.reset({
                id_equipo: ordenTrabajo.id_equipo,
                id_usuario: ordenTrabajo.id_usuario || 0,
                id_cliente: ordenTrabajo.id_cliente,
                area: ordenTrabajo.area,
                prioridad: ordenTrabajo.prioridad,
                descripcion: ordenTrabajo.descripcion,
                estado: ordenTrabajo.estado,
                passwordequipo: ordenTrabajo.passwordequipo || '',
                fecha_prometida: ordenTrabajo.fecha_prometida ? new Date(ordenTrabajo.fecha_prometida).toISOString().split('T')[0] : null,
                presupuesto: ordenTrabajo.presupuesto || undefined,
                adelanto: ordenTrabajo.adelanto || undefined,
                archivos: ordenTrabajo.imagenes || [],
            });
        }
    }, [ordenTrabajo, form, selectedClient]);

    const updateMutation = useMutation({
        mutationFn: updateOrdenTrabajo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ordenesTrabajo'] });
            toast.success('Orden de trabajo actualizada exitosamente');
        },
        onError: (error) => {
            toast.error('Error al actualizar la orden de trabajo');
            console.error('Error de actualización de orden:', error);
        },
    });

    const isBeforeToday = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const imageUrls = [];
            for (const file of selectedImages) {
                const url = await uploadImage(file);
                imageUrls.push(url);
            }

            // Asegúrate de que 'total' y 'confirmacion' están presentes
            const ordenTrabajoData: OrdenTrabajoUpdate = {
                id_orden: id_orden as number,  // El ID de la orden debe ser un número y no puede ser null
                id_equipo: values.id_equipo,
                id_usuario: values.id_usuario || null,
                id_cliente: values.id_cliente,
                area: values.area,
                prioridad: values.prioridad,
                descripcion: values.descripcion,
                estado: values.estado,
                fecha_prometida: values.fecha_prometida ? new Date(values.fecha_prometida) : null,
                presupuesto: values.presupuesto || null,
                adelanto: values.adelanto || null,
                total: 0, // Puedes ajustar este valor según tus necesidades
                confirmacion: false, // Puedes ajustar este valor según tus necesidades
                passwordequipo: values.passwordequipo || null,
                imagenes: imageUrls, // Las imágenes subidas
            };

            // Llamada al método de actualización
            updateMutation.mutate(ordenTrabajoData);
        } catch (error) {
            console.error("Error al subir las imágenes:", error);
            toast.error('Error al subir las imágenes');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error al cargar los datos</div>;

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 mt-5">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <Card className="w-full max-w-9xl overflow-x-auto">
                    <CardHeader>
                        <CardTitle>{ordenTrabajo?.numero_orden}</CardTitle>
                        <CardDescription>
                            Administra la información de la orden de trabajo.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="p-3">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base font-semibold">Información del Cliente</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                                            <div className="flex items-center space-x-2">
                                                <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 text-darkGreen" />
                                                <p className="text-sm font-medium">{ordenTrabajo?.cliente.cedula}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Mail className="w-4 h-4 text-darkGreen" />
                                                <a href={`mailto:${ordenTrabajo?.cliente?.correo}`}
                                                className="text-sm font-medium underline cursor-pointer">
                                                    {ordenTrabajo?.cliente?.correo}
                                                </a>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="w-4 h-4 text-darkGreen" />
                                                <p className="text-sm font-medium">{ordenTrabajo?.cliente?.celular}</p>
                                            </div>
                                            <FormField
                                                name="id_cliente"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <ClienteCombobox field={field} clientes={clientes} setSelectedClient={setSelectedClient} isClienteLoading={isClientesLoading} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                    <Card className="p-3">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base font-semibold">Información del Equipo</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                                            <div className="flex items-center space-x-2">
                                                <MonitorSmartphone className="w-4 h-4 text-darkGreen" />
                                                <p className="text-sm font-medium">Marca: {ordenTrabajo?.equipo?.marca?.nombre}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Info className="w-4 h-4 text-darkGreen" />
                                                <p className="text-sm font-medium">Modelo: {ordenTrabajo?.equipo?.modelo?.nombre}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <CreditCard className="w-4 h-4 text-darkGreen" />
                                                <p className="text-sm font-medium">Número de Serie: {ordenTrabajo?.equipo?.nserie}</p>
                                            </div>
                                            <FormField
                                                name="id_equipo"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <EquipoCombobox field={field} equipos={equipos} isEquipoLoading={isEquiposLoading} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
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
                                        name="passwordequipo"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contraseña</FormLabel>
                                                <FormControl>
                                                    <Input type="text" placeholder="Contraseña equipo/pin desbloqueo" {...field} />
                                                </FormControl>
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
                                    {form.watch('area') === 'reparacion' && (
                                        <FormField
                                            name="id_usuario"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Técnico</FormLabel>
                                                    <FormControl>
                                                        <TecnicoCombobox field={field} tecnicos={tecnicos} isTecnicoLoading={isTecnicosLoading} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
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
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(new Date(field.value + 'T00:00:00'), "PPP", { locale: es }) // Forzamos la medianoche local
                                                                ) : (
                                                                    <span>Selecciona una fecha</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(`${field.value}T00:00:00`) : undefined} // Forzamos la medianoche local
                                                            onSelect={(date) => {
                                                                console.log('Fecha seleccionada:', date); // Verifica la fecha seleccionada
                                                                field.onChange(date ? format(date, 'yyyy-MM-dd') : null); // Formato adecuado
                                                            }}
                                                            disabled={(date) => isBeforeToday(date)} // Función para deshabilitar fechas anteriores
                                                            initialFocus
                                                            locale={es}
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
                                            <FormLabel>Trabajo</FormLabel>
                                            <FormControl>
                                                <textarea
                                                    id="descripcion"
                                                    placeholder="Descripción"
                                                    className="w-full h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <ProductServiceTableShadCN />
                                <OrdenTrabajoTabs/>
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mr-2"
                                        onClick={() => navigate('/taller/ordenes')}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className='bg-darkGreen hover:bg-darkGreen/50 hover:text-black font-semibold'>
                                        {form.formState.isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Guardando...
                                            </>
                                        ) : (
                                            'Actualizar'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
