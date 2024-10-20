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
import { getOrdenTrabajoById, OrdenTrabajoUpdate, ProductoOrden, ServicioOrden, updateOrdenTrabajo } from '@/api/ordenTrabajoService'; // Importa correctamente tus servicios
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
import { CalendarIcon, CreditCard, Info, Loader2, Mail, MonitorSmartphone, Phone, X } from 'lucide-react';
import { Calendar } from '@/Components/ui/calendar';
import { es } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadphones, faIdCard } from '@fortawesome/free-solid-svg-icons';
import ProductServiceTableShadCN from '@/tables/productosyservicios/ProductsServicesTable';
import OrdenTrabajoTabs from '@/Components/OrdenTrabajoTabs';
import { addProductsToOrder } from '@/api/productOrdenService';
import { addServicesToOrder } from '@/api/serviceOrdenService';
import { addTareasToOrder, TareaOrden } from '@/api/tareasOrdenService';
import { Accesorio, getAccesorios } from '@/api/accesorioService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { AccesoriosCombobox } from '@/Components/comboBoxes/accesorio-combobox';
import { getAccesoriosByOrden, updateAccesoriosOrden } from '@/api/accesorioOrdenService';
import Spinner from '../../../assets/tube-spinner.svg';

interface Producto {
    id_producto: number;
    cantidad: number;
}
interface Servicio {
    id_servicio: number;
}
const formSchema = z.object({
    id_equipo: z.number().min(1, 'Equipo es requerido'),
    id_usuario: z.number().optional(),
    cliente_id: z.number().min(1, 'Cliente es requerido'),
    area: z.string().min(1, 'Área es requerida'),
    prioridad: z.string().min(1, 'Prioridad es requerida'),
    descripcion: z.string().min(1, 'Descripción es requerida'),
    estado: z.string().min(1, 'Estado es requerido'),
    passwordequipo: z.string().optional(),
    fecha_prometida: z
        .string()  // Aquí especificamos que es un string
        .nullable()
        .optional(),
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
    const [existingImages, setExistingImages] = useState<string[]>([]); // Imágenes existentes (URLs)
    const [selectedClient, setSelectedClient] = useState(0);
    const [selectedAccesorios, setSelectedAccesorios] = useState<Accesorio[]>([]);

    // Consulta para obtener los datos de la orden de trabajo por ID
    const { data: ordenTrabajo, isLoading, isError } = useQuery({
        queryKey: ['ordenTrabajo', id_orden],
        queryFn: () => id_orden ? getOrdenTrabajoById(id_orden) : Promise.resolve(null),
        enabled: !!id_orden,
    });
    // Estado para productos y servicios seleccionados
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoOrden[]>(ordenTrabajo?.productos || []);
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState<ServicioOrden[]>(ordenTrabajo?.servicios || []);
    const [tareasSeleccionadas, setTareasSeleccionadas] = useState<TareaOrden[]>(ordenTrabajo?.tareas || []);
    const [totalOrden, setTotalOrden] = useState(0);
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
    const { data: accesorios = [] } = useQuery<Accesorio[]>({
        queryKey: ['accesorios'],
        queryFn: getAccesorios,
    });
    const { data: accesoriosOrden = [], isLoading: isLoadingAccesorios } = useQuery({
        queryKey: ['accesoriosOrden', id_orden],
        queryFn: () => id_orden ? getAccesoriosByOrden(id_orden) : Promise.resolve([]),
        enabled: !!id_orden,
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id_equipo: 0,
            id_usuario: 0,
            cliente_id: 0,
            area: 'Entrada',
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
        if (ordenTrabajo) {
            setExistingImages(ordenTrabajo.imagenes.map(img => img.url_imagen));
            form.reset({
                id_equipo: ordenTrabajo.id_equipo,
                id_usuario: ordenTrabajo.id_usuario || 0,
                cliente_id: ordenTrabajo.cliente_id,
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
            navigate('/taller/ordenes'); // Redirige a la página
        },
        onError: (error) => {
            toast.error('Error al actualizar la orden de trabajo');
            console.error('Error de actualización de orden:', error);
        },
    });
    const addProductsMutation = useMutation({
        mutationFn: (data: { id_orden: number, productos: Producto[] }) => addProductsToOrder(data.id_orden, data.productos),
        onSuccess: () => {
            toast.success('Productos añadidos exitosamente');
        },
        onError: (error) => {
            toast.error('Error al añadir productos a la orden');
            console.error('Error al añadir productos:', error);
        },
    });
    const addServicesMutation = useMutation({
        mutationFn: (data: { id_orden: number, servicios: Servicio[] }) => addServicesToOrder(data.id_orden, data.servicios),
        onSuccess: () => {
            toast.success('Servicios añadidos exitosamente');
        },
        onError: (error) => {
            toast.error('Error al añadir servicios a la orden');
            console.error('Error al añadir servicios:', error);
        },
    });
    const addTasksMutation = useMutation({
        mutationFn: (data: { id_orden: number, tareas: { id_tarea: number, id_usuario?: number, status?: boolean }[] }) => {
            // Aseguramos que cada tarea tenga el id_orden
            const tareasConIdOrden = data.tareas.map((tarea) => ({
                ...tarea,
                id_orden: data.id_orden
            }));
            // Llamamos al método addTareasToOrder con el array de tareas modificado
            return addTareasToOrder(tareasConIdOrden);
        },
        onSuccess: () => {
            toast.success('Tareas añadidas exitosamente');
        },
        onError: (error) => {
            toast.error('Error al añadir tareas a la orden');
            console.error('Error al añadir tareas:', error);
        },
    });
    const isBeforeToday = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };
    const handleAgregarAccesorio = (accesorio: Accesorio) => {
        // Verifica que el accesorio no esté ya seleccionado
        if (!selectedAccesorios.some((a) => a.id_accesorio === accesorio.id_accesorio)) {
            setSelectedAccesorios((prev) => [...prev, accesorio]);
        }
    };
    const handleEliminarAccesorio = (id_accesorio: number) => {
        setSelectedAccesorios((prev) => prev.filter((a) => a.id_accesorio !== id_accesorio));
    };
    // Funciones para manejar los productos y servicios seleccionados
    const handleProductosChange = (productos: ProductoOrden[]) => {
        setProductosSeleccionados(productos);
    };
    const handleServiciosChange = (servicios: ServicioOrden[]) => {
        setServiciosSeleccionados(servicios);
    };
    const handleTotalOrden = (total: number) => {
        setTotalOrden(total);
    }
    // Función para manejar las tareas seleccionadas
    const handleTareasChange = (tareas: TareaOrden[]) => {
        setTareasSeleccionadas(tareas);
    };
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const imageUrls = [...existingImages]; // Incluir imágenes existentes
            for (const file of selectedImages) {
                const url = await uploadImage(file);
                imageUrls.push(url);
            }
            const ordenTrabajoData: OrdenTrabajoUpdate = {
                id_orden: id_orden as number,  // El ID de la orden debe ser un número y no puede ser null
                id_equipo: values.id_equipo,
                id_usuario: values.id_usuario || null,
                cliente_id: values.cliente_id,
                area: values.area,
                prioridad: values.prioridad,
                descripcion: values.descripcion,
                estado: values.estado,
                fecha_prometida: values.fecha_prometida ? new Date(values.fecha_prometida) : null,
                presupuesto: values.presupuesto || null,
                adelanto: values.adelanto || null,
                total: totalOrden,
                confirmacion: false,
                passwordequipo: values.passwordequipo || null,
                imagenes: imageUrls, // Las imágenes subidas
            };

            // Primero, actualizar la orden de trabajo
            await updateMutation.mutateAsync(ordenTrabajoData);
            // Mutación para añadir productos (si existen)
            if (productosSeleccionados.length > 0) {
                const productosToSend = productosSeleccionados.map(producto => ({
                    id_producto: producto.id_producto,
                    cantidad: producto.cantidad,
                }));
                await addProductsMutation.mutateAsync({ id_orden: id_orden as number, productos: productosToSend });
            }
            // Mutación para añadir servicios (si existen)
            if (serviciosSeleccionados.length > 0) {
                const serviciosToSend = serviciosSeleccionados.map(servicio => ({
                    id_servicio: servicio.id_servicio,
                }));
                await addServicesMutation.mutateAsync({ id_orden: id_orden as number, servicios: serviciosToSend });
            }
            // Mutación para añadir tareas (si existen)
            if (tareasSeleccionadas.length > 0) {
                const tareasToSend = tareasSeleccionadas.map(tarea => ({
                    id_tarea: tarea.id_tarea,
                    id_usuario: tarea.id_usuario !== null ? tarea.id_usuario : undefined, // Cambiar null por undefined
                    status: tarea.status, // opcional
                }));
                await addTasksMutation.mutateAsync({ id_orden: id_orden as number, tareas: tareasToSend });
            }
            // Verificar si hay accesorios seleccionados
            if (id_orden !== null && selectedAccesorios.length > 0) {
                // Crear un array de objetos que incluyan el id de la orden y el id del accesorio
                const accesoriosData = selectedAccesorios.map((accesorio) => ({
                    id_orden: id_orden,  // Aquí se pasa el id de la orden creada
                    id_accesorio: accesorio.id_accesorio,
                }));

                // Asignar los accesorios a la orden creada
                await updateAccesoriosOrden(id_orden , accesoriosData);
            }

        } catch (error) {
            console.error("Error al subir las imágenes:", error);
            toast.error('Error al subir las imágenes');
        }
    };
    useEffect(() => {
        if (ordenTrabajo && ordenTrabajo.productos) {
            setProductosSeleccionados(ordenTrabajo.productos);
        }
        if (ordenTrabajo && ordenTrabajo.servicios) {
            setServiciosSeleccionados(ordenTrabajo.servicios)
        }
        if (ordenTrabajo && ordenTrabajo.tareas) {
            setTareasSeleccionadas(ordenTrabajo.tareas);
        }
        if (accesoriosOrden && accesoriosOrden.length > 0) {
            // Establece los accesorios seleccionados basados en la consulta
            const accesoriosTransformados = accesoriosOrden.map(ordenAccesorio => ({
                id_accesorio: ordenAccesorio.Accesorio.id_accesorio,
                nombre: ordenAccesorio.Accesorio.nombre
            }));
            setSelectedAccesorios(accesoriosTransformados);
        }
        
    }, [ordenTrabajo, accesoriosOrden]);

    // useEffect(() => {
    //   console.log("Productos Seleccionados: ", productosSeleccionados)
    // }, [productosSeleccionados])

    // useEffect(() => {
    //   console.log("Tareas Seleccionadas: ", tareasSeleccionadas)
    // }, [tareasSeleccionadas])
    useEffect(() => {
      console.log("Accesorios Seleccionados: ", selectedAccesorios)
    }, [selectedAccesorios])



    if (isLoading || isLoadingAccesorios) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="p-3">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base font-semibold">Información del Cliente</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-1">
                                            <div className="flex items-center space-x-2">
                                                <FontAwesomeIcon icon={faIdCard} className="w-4 h-4 text-darkGreen" />
                                                <p className="text-sm font-medium">{ordenTrabajo?.equipo?.cliente?.cedula}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Mail className="w-4 h-4 text-darkGreen" />
                                                <a href={`mailto:${ordenTrabajo?.equipo?.cliente?.correo}`}
                                                    className="text-sm font-medium underline cursor-pointer">
                                                    {ordenTrabajo?.equipo?.cliente?.correo}
                                                </a>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Phone className="w-4 h-4 text-darkGreen" />
                                                <p className="text-sm font-medium">{ordenTrabajo?.equipo?.cliente?.celular}</p>
                                            </div>
                                            <FormField
                                                name="cliente_id"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <ClienteCombobox field={field} clientes={clientes} setSelectedClient={setSelectedClient} isClienteLoading={isClientesLoading} disabled={!!ordenTrabajo} />
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
                                                <p className="text-sm font-medium">Marca: {ordenTrabajo?.equipo?.modelo?.marca?.nombre}</p>
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
                                                            <EquipoCombobox field={field} equipos={equipos} isEquipoLoading={isEquiposLoading} disabled={!!ordenTrabajo} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                                    <Input type="text" placeholder="Contraseña equipo/pin desbloqueo"  {...field} />
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
                                                        <SelectItem value="Entrada">Entrada</SelectItem>
                                                        <SelectItem value="Reparación">Reparación</SelectItem>
                                                        <SelectItem value="Salida">Salida</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {form.watch('area') === 'Reparación' && (
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
                                <div className="grid gap-4 mt-4">
                                    {/* Combos de Plantillas y Accesorios - Ocupan todo el ancho disponible */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        <div className="w-full">
                                            <p className="text-sm font-medium text-black mb-1">Accesorios</p>
                                            <AccesoriosCombobox
                                                accesorios={accesorios}
                                                onSelect={handleAgregarAccesorio}
                                            />
                                        </div>
                                    </div>
                                    {/* Áreas de Plantillas y Accesorios seleccionados - Ocupan todo el ancho disponible */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        {/* Área de Accesorios seleccionados */}
                                        <div className="p-4 shadow-md border rounded-lg bg-gray-50 w-full" style={{ minHeight: '8rem' }}>
                                            <div className={`grid gap-4 ${selectedAccesorios.length > 0 ? 'grid-cols-2' : 'place-items-center'}`}>
                                                {selectedAccesorios.length > 0 ? (
                                                    selectedAccesorios.map((accesorio) => (
                                                        <div
                                                            key={accesorio.id_accesorio}
                                                            className="flex items-center justify-between bg-customGreen px-4 py-2 border rounded-lg shadow-sm text-sm truncate cursor-pointer"
                                                        >
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <span className="truncate text-black font-bold">
                                                                            {accesorio.nombre}
                                                                        </span>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent className="bg-customGray text-white">
                                                                        <p>{accesorio.nombre}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                            <button
                                                                type="button"
                                                                className="ml-3 text-white rounded-full h-6 w-6 flex items-center justify-center"
                                                                onClick={() => handleEliminarAccesorio(accesorio.id_accesorio)}
                                                            >
                                                                <X className="h-4 w-4 text-muted-foreground" />
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center p-4 text-gray-500 border border-dashed rounded-md w-auto h-28">
                                                        <FontAwesomeIcon icon={faHeadphones} className="w-10 h-10 mb-2" />
                                                        <p className="text-sm text-center">No se han seleccionado accesorios</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
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
                                <ProductServiceTableShadCN
                                    productos={productosSeleccionados || []}
                                    servicios={serviciosSeleccionados || []}
                                    ordenId={id_orden || 0}
                                    onProductosChange={handleProductosChange}
                                    onServiciosChange={handleServiciosChange}
                                    onTotalChange={handleTotalOrden}
                                    adelanto={form.watch('adelanto')}
                                />
                                <OrdenTrabajoTabs
                                    tasks={tareasSeleccionadas}
                                    ordenId={id_orden || 1} selectedImages={selectedImages}
                                    setSelectedImages={setSelectedImages}
                                    existingImages={existingImages}
                                    setExistingImages={setExistingImages}
                                    onProductosChange={handleProductosChange}
                                    onServiciosChange={handleServiciosChange}
                                    onTareasChange={handleTareasChange}
                                    productosSeleccionados={productosSeleccionados}
                                    serviciosSeleccionados={serviciosSeleccionados} />
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mr-2"
                                        onClick={() => navigate('/taller/ordenes')}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className='bg-customGreen hover:bg-darkGreen/50 text-black font-semibold'>
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
