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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { EquipoCombobox } from '@/Components/comboBoxes/equipo-combobox';
import { Equipo, getEquipos } from '@/api/equipoService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Spinner from '../../../assets/tube-spinner.svg';
import fileUploader from '../../../assets/icons/file-upload.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk, faCircleXmark, faHeadphones, faPlus } from '@fortawesome/free-solid-svg-icons';
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
import { ResponsiveDialog } from '@/Components/responsive-dialog';
import UserForm from '../clientes/client-form';
import { useEffect, useState } from 'react';
import { ResponsiveDialogExtended } from '@/Components/responsive-dialog-extended';
import BrandModelForm from '../brandModel/brand-model-from';
import TipoEquipoForm from '../tiposEquipo/tipo-equipo-form';
import EquipoForm from '../equipos/equipo-form';
import { Brand, getBrands } from '@/api/marcasService';
import { getModels, Model } from '@/api/modeloService';
import { DeviceType, getDeviceTypes } from '@/api/tipoEquipoService';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, X } from 'lucide-react';
import { Calendar } from '@/Components/ui/calendar';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { createOrdenTrabajo, OrdenTrabajoCreate } from '@/api/ordenTrabajoService';
import { uploadImage } from '@/lib/firebase'; // Asegúrate de importar la función correcta
import { AccesoriosCombobox } from '@/Components/comboBoxes/accesorio-combobox';
import { Accesorio, getAccesorios } from '@/api/accesorioService';
import { addAccesoriosToOrden } from '@/api/accesorioOrdenService';

const formSchema = z.object({
  id_equipo: z.number().min(1, 'Equipo es requerido'),
  id_usuario: z.number().optional(), // Ahora es opcional
  cliente_id: z.number().min(1, 'Cliente es requerido'),
  area: z.string().min(1, 'Área es requerida'),
  prioridad: z.string().min(1, 'Prioridad es requerida'),
  descripcion: z.string().min(1, 'Descripción es requerida'),
  estado: z.string().min(1, 'Estado es requerido'),
  passwordequipo: z.string().optional(),
  fecha_prometida: z
    .union([z.date(), z.null()])  // Permitir tanto Date como null
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
  plantillas: z.array(z.number()).optional(),

});

export default function OrdenTrabajoForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCreateClienteOpen, setIsCreateClienteOpen] = useState(false);
  const [isCreateEquipoOpen, setIsCreateEquipoOpen] = useState(false);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [isAddingTipoEquipo, setIsAddingTipoEquipo] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedClient, setSelectedClient] = useState(0);
  const [filteredDevices, setFilteredDevices] = useState<Equipo[]>([]);
  const [selectedAccesorios, setSelectedAccesorios] = useState<Accesorio[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prevImages) => [...prevImages, ...files]); // Mantén las imágenes anteriores y añade las nuevas
  };
  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
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
  const { data: marcas = [], isLoadingError: marcasError } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: getBrands,
  });
  const { data: modelos = [], isLoadingError: modelsError } = useQuery<Model[]>({
    queryKey: ['models'],
    queryFn: getModels,
  });
  const { data: tiposEquipo = [], isLoadingError: deviceTypesError } = useQuery<DeviceType[]>({
    queryKey: ['deviceTypes'],
    queryFn: getDeviceTypes,
  });
  const { data: accesorios = [] } = useQuery<Accesorio[]>({
    queryKey: ['accesorios'],
    queryFn: getAccesorios,
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
      fecha_prometida: null, // Cambiar a null o undefined
      presupuesto: undefined,
      adelanto: undefined,
      archivos: [], // Default vacío para archivos
      plantillas: [], // Por defecto será un array vacío
    },
  });
  // Define la mutación para crear la orden de trabajo
  const createMutation = useMutation({
    mutationFn: createOrdenTrabajo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordenesTrabajo'] }); // Invalida la consulta de órdenes para que se refresquen los datos
      toast.success('Orden de trabajo creada exitosamente');
      navigate('/taller/ordenes'); // Redirige después de la creación
    },
    onError: (error) => {
      toast.error('Error al crear la orden de trabajo');
      console.error('Error de creación de orden:', error);
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Método onSubmit para manejar la creación de la orden de trabajo
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const imageUrls = [];
      for (const file of selectedImages) {
        const url = await uploadImage(file);
        imageUrls.push(url);
      }
      // Crear el objeto de datos de la orden de trabajo
      const ordenTrabajoData: OrdenTrabajoCreate = {
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
        total: 0,
        confirmacion: false,
        passwordequipo: values.passwordequipo || null,
        imagenes: imageUrls, // Asigna las URLs de las imágenes subidas
      };

      // Crear la orden de trabajo primero
      const newOrder = await createMutation.mutateAsync(ordenTrabajoData);
      // Verificar si hay accesorios seleccionados
      if (selectedAccesorios.length > 0) {
        // Crear un array de objetos que incluyan el id de la orden y el id del accesorio
        const accesoriosData = selectedAccesorios.map((accesorio) => ({
          id_orden: newOrder.id_orden,  // Aquí se pasa el id de la orden creada
          id_accesorio: accesorio.id_accesorio,
        }));

        // Asignar los accesorios a la orden creada
        await addAccesoriosToOrden(accesoriosData);
      }
    } catch (error) {
      console.error("Error al crear la orden:", error);
      toast.error('Error al crear la orden');
    }
  };
  useEffect(() => {
    if (selectedClient) {
      setFilteredDevices(equipos.filter(equipo => equipo.id_cliente === selectedClient));
      form.setValue('id_equipo', 0); // Resetea el campo a su valor inicial
    } else {
      setFilteredDevices([]);
    }
  }, [selectedClient, equipos, form]);

  if (isEquipoLoading || isClienteLoading || isTecnicoLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
  if (error || marcasError || modelsError || deviceTypesError ) return toast.error('Error al recuperar los datos');

  const selectedArea = form.watch('area');

  const isBeforeToday = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 mt-5">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <ResponsiveDialog
          isOpen={isCreateClienteOpen}
          setIsOpen={setIsCreateClienteOpen}
          title={`Nuevo cliente`}
          description='Por favor, ingresa la información solicitada'
        >
          <UserForm setIsOpen={setIsCreateClienteOpen} />
        </ResponsiveDialog>
        <ResponsiveDialogExtended
          isOpen={isCreateEquipoOpen}
          setIsOpen={(open) => {
            setIsCreateEquipoOpen(open);
            if (!open) {
              setIsAddingBrand(false);
              setIsAddingTipoEquipo(false);
            }
          }}
          title={
            isAddingBrand ? 'Nueva marca y modelo' :
              isAddingTipoEquipo ? 'Nuevo tipo de equipo' :
                'Nuevo equipo'
          }
          description={
            isAddingBrand ? 'Por favor, ingrese la información de la nueva marca y modelo' :
              isAddingTipoEquipo ? 'Por favor, ingrese la información del nuevo tipo de equipo' :
                'Por favor, ingresa la información solicitada'
          }
        >
          {isAddingBrand ? (
            <BrandModelForm setIsOpen={setIsCreateEquipoOpen} setIsAddingBrand={setIsAddingBrand} />
          ) : isAddingTipoEquipo ? (
            <TipoEquipoForm setIsOpen={setIsCreateEquipoOpen} setIsAddingTipoEquipo={setIsAddingTipoEquipo} />
          ) : (
            <EquipoForm
              setIsOpen={setIsCreateEquipoOpen}
              brands={marcas}
              models={modelos}
              owners={clientes}
              deviceTypes={tiposEquipo}
              setIsAddingBrand={setIsAddingBrand}
              setIsAddingTipoEquipo={setIsAddingTipoEquipo}
            />
          )}
        </ResponsiveDialogExtended>
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
                    name="cliente_id"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3' /></span></FormLabel>
                        <div className='flex items-center gap-1'>
                          <FormControl>
                            <ClienteCombobox field={field} clientes={clientes} isClienteLoading={isClienteLoading} setSelectedClient={setSelectedClient} />
                          </FormControl>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  className='rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3'
                                  type="button"
                                  onClick={() => setIsCreateClienteOpen(true)}
                                >
                                  <FontAwesomeIcon icon={faPlus} />
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
                        <FormLabel>Equipo <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3' /></span></FormLabel>
                        <div className='flex items-center gap-1'>
                          <FormControl>
                            <EquipoCombobox field={field} equipos={filteredDevices} isEquipoLoading={isEquipoLoading} disabled={!selectedClient} />
                          </FormControl>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  className='rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3'
                                  type="button"
                                  onClick={() => setIsCreateEquipoOpen(true)}
                                >
                                  <FontAwesomeIcon icon={faPlus} />
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
                            <SelectItem value="Entrada">Entrada</SelectItem>
                            <SelectItem value="Reparación">Reparación</SelectItem>
                            <SelectItem value="Salida">Salida</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {(selectedArea === 'Reparación' || selectedArea === 'Salida') && (
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
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(new Date(field.value), "PPP", { locale: es }) // Asegúrate de que la fecha sea convertida correctamente
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
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => {
                                field.onChange(date);
                              }}
                              disabled={(date) => isBeforeToday(date)}  // Usar la función truncada
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
                      <p className="text-sm font-medium text-black mb-1 mt-6">Accesorios</p>
                      <AccesoriosCombobox
                        accesorios={accesorios}
                        onSelect={handleAgregarAccesorio}
                      />
                    </div>
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
                      <FormLabel>Trabajo <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3' /></span></FormLabel>
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
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-customGreen/50 rounded-lg p-4 bg-customGreen/5 mt-4 w-full">
                    {selectedImages.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                          {selectedImages.map((file, index) => (
                            <div key={index} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`preview-${index}`}
                                className="object-contain w-full h-48 md:h-64 rounded-lg shadow-md"
                                style={{ objectPosition: 'center' }}
                              />
                              <Button
                                type="button"
                                className="absolute top-2 right-2 bg-transparent hover:bg-transparent"
                                onClick={() => handleRemoveImage(index)}
                              >
                                <FontAwesomeIcon icon={faCircleXmark} className='text-customGreen w-8 h-8 hover:text-customGreenHover' />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button
                          type='button'
                          variant="secondary"
                          className="mt-4 bg-customGreen/30 hover:bg-customGreenHover/30"
                          onClick={() => document.getElementById('fileInput')?.click()} // Safe navigation operator
                        >
                          Agregar más imágenes
                        </Button>
                      </>
                    ) : (
                      <>
                        <img
                          src={fileUploader}
                          width={96}
                          height={77}
                          alt='file-upload'
                        />
                        <p className="text-sm text-gray-500 mt-2">Añade imagenes del equipo para adjuntar en la orden de trabajo</p>
                        <Button
                          type='button'
                          variant="secondary"
                          className="mt-2 bg-customGreen/30 hover:bg-customGreenHover/30"
                          onClick={() => document.getElementById('fileInput')?.click()} // Safe navigation operator
                        >
                          Navegar
                        </Button>
                      </>
                    )}
                    <FormField
                      name="archivos"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          id="fileInput"
                          type="file"
                          accept="image/*" // Accept only images
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            handleImageChange(e);
                            field.onChange(selectedImages);
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="mr-2"
                    onClick={() => navigate('/taller/ordenes')}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading} className='bg-customGreen hover:bg-customGreenHover text-black'>
                    {isLoading ? (
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
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
