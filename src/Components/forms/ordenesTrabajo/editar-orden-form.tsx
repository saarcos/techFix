import { Link, useNavigate, useParams } from 'react-router-dom'; // Asegúrate de tener el hook de react-router-dom
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { getOrdenTrabajoById, OrdenTrabajoUpdate, updateOrdenTrabajo } from '@/api/ordenTrabajoService'; // Importa correctamente tus servicios
import { uploadImage } from '@/lib/firebase'; // Asegúrate de importar la función correcta
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Input } from '@/Components/ui/input';
import { TecnicoCombobox } from '@/Components/comboBoxes/tecnico-combobox';
import { getUsers, User } from '@/api/userService';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { AlertTriangle, CalendarIcon, CreditCard, Info, Loader2, Mail, MonitorSmartphone, Phone, X } from 'lucide-react';
import { Calendar } from '@/Components/ui/calendar';
import { es } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComputer, faHeadphones, faIdCard, faIdCardClip } from '@fortawesome/free-solid-svg-icons';
import OrdenTrabajoTabs from '@/Components/OrdenTrabajoTabs';
import { Accesorio, getAccesorios } from '@/api/accesorioService';
import { DetalleOrden } from '@/api/detalleOrdenService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { AccesoriosCombobox } from '@/Components/comboBoxes/accesorio-combobox';
import { getAccesoriosByOrden, updateAccesoriosOrden } from '@/api/accesorioOrdenService';
import Spinner from '../../../assets/tube-spinner.svg';
import { countRepairs } from '@/api/equipoService';
import { createDetallesOrden, getDetallesByOrdenId } from '@/api/detalleOrdenService';

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
}).refine((data) => {
    // Si el área es "Reparación" o "Salida", entonces `id_usuario` no debe ser null
    if (data.area === 'Reparación' || data.area === 'Salida') {
        return data.id_usuario && data.id_usuario > 0;
    }
    return true; // Para "Entrada" `id_usuario` puede ser null
}, {
    message: 'Técnico es requerido para el área de Reparación o Salida',
    path: ['id_usuario'], // Especifica que el error es en `id_usuario`
});;
export default function OrdenTrabajoEditForm() {
    const { id } = useParams(); // Obtener el id desde la URL
    const id_orden = id ? parseInt(id, 10) : null; // Asegúrate de que id no sea undefined antes de convertirlo
    const queryClient = useQueryClient();
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]); // Imágenes existentes (URLs)
    const [selectedAccesorios, setSelectedAccesorios] = useState<Accesorio[]>([]);
    const [repairCount, setRepairCount] = useState<number | null>(null); // Para almacenar la cantidad de reparaciones
    const [totalOrden, setTotalOrden] = useState<number>(0);
    const [areaSeleccionada, setAreaSeleccionada] = useState('Entrada'); // Valor inicial
    const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState<number | null>(null);

    // Consulta para obtener los datos de la orden de trabajo por ID
    const { data: ordenTrabajo, isLoading, isError } = useQuery({
        queryKey: ['ordenTrabajo', id_orden],
        queryFn: () => id_orden ? getOrdenTrabajoById(id_orden) : Promise.resolve(null),
        enabled: !!id_orden,
    });
    const [detallesSeleccionados, setDetallesSeleccionados] = useState<DetalleOrden[]>(ordenTrabajo?.detalles || []);

    const navigate = useNavigate();

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
    // En tu componente OrdenTrabajoEditForm
    const { data: detallesOrden = [], isLoading: isLoadingDetalles } = useQuery({
        queryKey: ['detallesOrden', id_orden],
        queryFn: () => id_orden ? getDetallesByOrdenId(id_orden) : Promise.resolve([]),
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
            setAreaSeleccionada(ordenTrabajo.area); // Inicializar estado del área
            setTecnicoSeleccionado(ordenTrabajo.id_usuario || null); // Inicializar estado del técnico
        }
    }, [ordenTrabajo, form]);
    // Observa los cambios en el campo "area" y "id_usuario" en tiempo real
    useEffect(() => {
        const subscription = form.watch((value) => {
            setAreaSeleccionada(value.area || "Entrada");
            setTecnicoSeleccionado(value.id_usuario || 0);
        });
        return () => subscription.unsubscribe();
    }, [form]);

    // Llama a la función countRepairs para obtener la cantidad de reparaciones
    useEffect(() => {
        const fetchRepairCount = async () => {
            if (ordenTrabajo && ordenTrabajo.id_equipo) {
                try {
                    const { repairCount } = await countRepairs(ordenTrabajo.id_equipo);
                    setRepairCount(repairCount);
                } catch (error) {
                    console.error("Error al obtener el conteo de reparaciones:", error);
                    toast.error("Error al obtener el conteo de reparaciones");
                }
            }
        };
        fetchRepairCount();
    }, [ordenTrabajo, detallesOrden]);

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
    // Mutación para agregar detalles a la orden de trabajo
    const addDetallesMutation = useMutation({
        mutationFn: createDetallesOrden,
        onError: (error) => {
            toast.error('Error al agregar detalles a la orden');
            console.error(error);
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
    const handleDetallesChange = (detalles: DetalleOrden[]) => {
        setDetallesSeleccionados(detalles);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (detallesSeleccionados.length === 0) {
            toast.warning("Debes ingresar al menos un detalle antes de guardar.");
            return;
        }
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


            // Agrega los detalles después de actualizar la orden
            if (id_orden && detallesSeleccionados.length > 0) {
                const detallesData = detallesSeleccionados.map((detalle) => ({
                    id_orden: id_orden,
                    id_usuario: detalle.id_usuario || undefined,  // Cambiar null por undefined
                    id_servicio: detalle.servicio ? detalle.id_servicio : undefined,
                    id_producto: detalle.producto ? detalle.id_producto : undefined,
                    precioservicio: detalle.servicio ? parseFloat(detalle.precioservicio?.toString() || "0") : undefined,
                    precioproducto: detalle.producto ? parseFloat(detalle.precioproducto?.toString() || "0") : undefined,
                    cantidad: detalle.producto ? detalle.cantidad : undefined,
                    status: detalle.status || false
                }));
                // Llama a createDetallesOrden para crear múltiples detalles a la vez
                await addDetallesMutation.mutateAsync(detallesData); // Usar la mutación
            }
            // Verificar si hay accesorios seleccionados
            if (id_orden !== null && selectedAccesorios.length > 0) {
                // Crear un array de objetos que incluyan el id de la orden y el id del accesorio
                const accesoriosData = selectedAccesorios.map((accesorio) => ({
                    id_orden: id_orden,  // Aquí se pasa el id de la orden creada
                    id_accesorio: accesorio.id_accesorio,
                }));

                // Asignar los accesorios a la orden creada
                await updateAccesoriosOrden(id_orden, accesoriosData);
            }

        } catch (error) {
            console.error("Error al subir las imágenes:", error);
            toast.error('Error al subir las imágenes');
        }
    };
    useEffect(() => {

        if (accesoriosOrden && accesoriosOrden.length > 0) {
            // Establece los accesorios seleccionados basados en la consulta
            const accesoriosTransformados = accesoriosOrden.map(ordenAccesorio => ({
                id_accesorio: ordenAccesorio.Accesorio.id_accesorio,
                nombre: ordenAccesorio.Accesorio.nombre
            }));
            setSelectedAccesorios(accesoriosTransformados);
        }
        if (ordenTrabajo && ordenTrabajo.detalles) {
            setDetallesSeleccionados(ordenTrabajo.detalles);
        }

    }, [ordenTrabajo, accesoriosOrden]);
    const isSubmitDisabled = (areaSeleccionada === 'Reparación' || areaSeleccionada === 'Salida' || detallesSeleccionados.length ===0) && !tecnicoSeleccionado;
    if (isLoading || isLoadingAccesorios || isLoadingDetalles) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
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
                        {repairCount !== null && repairCount > 1 && (
                            <div className="bg-customGreen/60 border border-gray-300 text-gray-700 rounded-md w-full p-3 mb-4 flex items-center justify-center shadow-sm">
                                <AlertTriangle className="h-5 w-5 mr-2 " />
                                <span>
                                    <strong className="text-gray-700">¡Atención!</strong> Este equipo ha sido reparado {repairCount - 1}{" "}
                                    {repairCount - 1 === 1 ? "vez" : "veces"} antes,
                                </span>
                                <Link
                                    to={`/taller/equipo/${ordenTrabajo?.id_equipo}/ordenes`}
                                    className="ml-2 font-bold text-gray-600 hover:text-gray-800 underline"
                                >
                                    ver órdenes anteriores.
                                </Link>
                            </div>
                        )}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Card className="p-4 shadow-md border rounded-lg bg-gray-50 relative">
                                        <div className="absolute opacity-10 text-darkGreen/100 right-4 top-4">
                                            <FontAwesomeIcon icon={faIdCardClip} size="6x" />
                                        </div>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base font-semibold">Información del Cliente</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
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
                                        </CardContent>
                                    </Card>
                                    <Card className="p-4 shadow-md border rounded-lg bg-gray-50 relative">
                                        <div className="absolute opacity-10 text-darkGreen/100 right-4 top-4">
                                            <FontAwesomeIcon icon={faComputer} size="6x" />
                                        </div>
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
                                                    <div className="flex flex-col items-center justify-center p-4 text-gray-500 border border-dashed rounded-md  h-28">
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
                                <OrdenTrabajoTabs
                                    detalles={detallesSeleccionados}
                                    onDetallesChange={handleDetallesChange}
                                    ordenId={id_orden || 1} selectedImages={selectedImages}
                                    setSelectedImages={setSelectedImages}
                                    existingImages={existingImages}
                                    setExistingImages={setExistingImages}
                                    tecnicos={tecnicos}
                                    onTotalChange={setTotalOrden}  // Pasar setTotalOrden como onTotalChange
                                />
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mr-2"
                                        onClick={() => navigate('/taller/ordenes')}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit"
                                        className={`cursor-pointer bg-darkGreen hover:bg-darkGreen/50 text-white font-semibold ${isSubmitDisabled ? 'cursor-not-allowed' : ''}`}
                                        disabled={isSubmitDisabled}>
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
