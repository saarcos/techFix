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
import { ArrowDown, Check, Loader2 } from 'lucide-react';
import { FieldValues, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getEquipoById, updateEquipo, createEquipo, Equipo, countEquipos } from '@/api/equipoService';
import { toast } from 'sonner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Brand } from '@/api/marcasService';
import { Model } from '@/api/modeloService';
import { Client } from '@/api/clientService';
import { DeviceType } from '@/api/tipoEquipoService';
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip"

const formSchema = z.object({
  id_cliente: z.number().min(1, 'Cliente es requerido'),
  id_tipoe: z.number().min(1, 'Tipo es requerido'),
  marca_id: z.number().min(1, 'Marca es requerido'),
  id_modelo: z.number().min(1, 'Modelo es requerido'),
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
  setIsAddingBrand: Dispatch<SetStateAction<boolean>>;
  setIsAddingTipoEquipo: Dispatch<SetStateAction<boolean>>;
}

// Interfaz para el combo box de propietarios (clientes)
interface ClienteComboboxProps {
  field: FieldValues;
  owners: Client[];
  isEquipoLoading: boolean;
}

// Componente para el combo box de propietarios
function ClienteCombobox({ field, owners, isEquipoLoading }: ClienteComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(field.value?.toString() || "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (id_cliente: string, nombre: string, apellido: string) => {
    console.log(value)
    setValue(`${nombre} ${apellido}`); // Mostrar el nombre y apellido seleccionado en el botón
    field.onChange(parseInt(id_cliente, 10)); // Asignar el id_cliente al formulario
    setOpen(false);
    setSearchTerm("");
  };

  const filteredOwners = owners.filter(owner =>
    `${owner.nombre} ${owner.apellido}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOwner = owners.find(owner => owner.id_cliente.toString() === field.value?.toString());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10"
          disabled={isEquipoLoading}
        >
          {selectedOwner ? `${selectedOwner.nombre} ${selectedOwner.apellido}` : "Propietario"}
          <ArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Buscar Propietario..."
            className="h-9"
            onValueChange={(value) => setSearchTerm(value)} // Actualiza el término de búsqueda
          />
          <CommandList>
            <CommandEmpty>No se encontró ningún propietario.</CommandEmpty>
            <CommandGroup>
              {filteredOwners.map((owner) => (
                <CommandItem
                  key={owner.id_cliente}
                  value={`${owner.nombre} ${owner.apellido}`}
                  onSelect={() => handleSelect(owner.id_cliente.toString(), owner.nombre, owner.apellido)}
                >
                  {owner.nombre} {owner.apellido}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      field.value?.toString() === owner.id_cliente.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
export default function EquipoForm({ equipoId, setIsOpen, brands, models, owners, deviceTypes, setIsAddingBrand, setIsAddingTipoEquipo }: EquipoFormProps) {
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);  // Estado para la marca seleccionada
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);  // Estado para los modelos filtrados
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_cliente: 0,
      id_tipoe: 0,
      marca_id: 0,
      id_modelo: 0,
      nserie: '',
      descripcion: '',
    },
  });

  const { watch, setValue } = form;
  const selectedTipo = watch('id_tipoe');
  const selectedMarca = watch('marca_id');
  const selectedModelo = watch('id_modelo');
  const [loading, setLoading] = useState(false);  // Estado para manejar el loading


  useEffect(() => {
    const generateSerialNumber = async () => {
      setLoading(true); // Muestra el indicador de carga
      try {
        const tipo = deviceTypes.find(t => t.id_tipoe === selectedTipo)?.nombre.substring(0, 2).toUpperCase() || '';
        const marca = brands.find(b => b.id_marca === selectedMarca)?.nombre.substring(0, 2).toUpperCase() || '';
        const modelo = models.find(m => m.id_modelo === selectedModelo)?.nombre.substring(0, 3).toUpperCase() || '';
        const year = new Date().getFullYear().toString().slice(-2);

        // Llamada al servicio para obtener el secuencial
        const response = await countEquipos({
          id_tipoe: selectedTipo,
          marca_id: selectedMarca,
          id_modelo: selectedModelo,
        });

        const sequential = response.nextSequential;

        // Generar el número de serie completo
        const serialNumber = `${tipo}-${marca}-${modelo}-${year}-${sequential}`;
        setValue('nserie', serialNumber);  // Asignar el número de serie generado al campo nserie
      } catch (error) {
        console.error('Error al generar el número de serie:', error);
      } finally {
        setLoading(false);  // Deja de mostrar el indicador de carga
      }
    };

    if (selectedTipo && selectedMarca && selectedModelo) {
      generateSerialNumber();  // Llama a la función para generar el número de serie
    }
  }, [selectedTipo, selectedMarca, selectedModelo, setValue, deviceTypes, brands, models]);

  const queryClient = useQueryClient();
  const { data: equipo, isLoading: isEquipoLoading, isError, error } = useQuery<Equipo>({
    queryKey: ['equipo', equipoId],
    queryFn: () => equipoId ? getEquipoById(equipoId) : Promise.resolve({
      id_cliente: 0,
      id_tipoe: 0,
      marca_id: 0,
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
      if (equipo.marca_id) {
        setSelectedBrand(equipo.marca_id);
      }
      form.reset({
        id_cliente: equipo.id_cliente,
        id_tipoe: equipo.id_tipoe,
        marca_id: equipo.marca_id,
        id_modelo: equipo.id_modelo,
        nserie: equipo.nserie,
        descripcion: equipo.descripcion,
      });
    }

    if (isError) {
      console.error('Error fetching equipo data:', error);
    }
  }, [equipo, isError, error, form]);
  useEffect(() => {
    if (selectedBrand) {
      setFilteredModels(models.filter(model => model.id_marca === selectedBrand));
    } else {
      setFilteredModels([]);
    }
  }, [selectedBrand, models]);

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
          name="marca_id"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel htmlFor="id_marca" className='items-center text-center'>
                Marca <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3' /></span>
              </FormLabel>
              <div className="flex items-center gap-1">
                <FormControl>
                  <select
                    id="id_marca"
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-customGray shadow-sm cursor-pointer"
                    {...field}
                    value={field.value.toString()} // Convierte el valor a string para mostrar en el select
                    onChange={(e) => {
                      const selectedValue = parseInt(e.target.value, 10);
                      field.onChange(selectedValue);
                      setSelectedBrand(selectedValue);
                    }}
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className='rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3'
                        type="button"
                        onClick={() => {
                          setIsAddingBrand(true);
                        }}>
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className='bg-customGray text-white border-none font-semibold'>
                      <p>Añade una nueva marca y modelo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="id_modelo"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel
                htmlFor="id_modelo"
                className={cn(
                  "",
                  !selectedBrand ? "text-gray-400" : "text-black"
                )}
              >
                Modelo <span className={cn("text-red-500", !selectedBrand && "opacity-50")}>
                  <FontAwesomeIcon icon={faAsterisk} className="w-3 h-3" />
                </span>
              </FormLabel>
              <div className="flex items-center gap-1">
                <FormControl>
                  <select
                    id="id_modelo"
                    className={cn(
                      "h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background cursor-pointer",
                      !selectedBrand || isEquipoLoading ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-background text-black cursor-pointer"
                    )}                    {...field}
                    value={field.value.toString()} // Convierte el valor a string para mostrar en el select
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))} // Convierte el valor de vuelta a número al seleccionar
                    disabled={!selectedBrand || isEquipoLoading}  // Deshabilitado si no hay marca seleccionada
                  >
                    <option value="">{!selectedBrand ? ("Selecciona una marca primero") : "Seleccionar modelo"} </option>
                    {filteredModels.map((model) => (
                      <option key={model.id_modelo} value={model.id_modelo}>{model.nombre}</option>
                    ))}
                  </select>
                </FormControl>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className='rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3'
                        type="button"
                        onClick={() => {
                          setIsAddingBrand(true);
                        }}>
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className='bg-customGray text-white border-none font-semibold'>
                      <p>Añade una nueva marca y modelo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="id_tipoe"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel htmlFor="id_tipoe">
                Tipo <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3' /></span>
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
                    {deviceTypes.map((tipo) => (
                      <option key={tipo.id_tipoe} value={tipo.id_tipoe}>{tipo.nombre}</option>
                    ))}
                  </select>
                </FormControl>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className='rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3'
                        type="button"
                        onClick={() => {
                          setIsAddingTipoEquipo(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className='bg-customGray text-white border-none font-semibold'>
                      <p>Añade un nuevo tipo de equipo</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="id_cliente"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel htmlFor="id_cliente">
                Propietario <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3' /></span>
              </FormLabel>
              <div className="flex items-center gap-1">
                <FormControl>
                  <ClienteCombobox field={field} owners={owners} isEquipoLoading={isEquipoLoading} />
                </FormControl>
              </div>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="nserie"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel htmlFor="nserie">
                N° Serie <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className="w-3 h-3" /></span>
              </FormLabel>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-1">
                <FormControl className="w-full sm:w-auto">
                  <Input
                    id="nserie"
                    readOnly={true}  // Solo lectura
                    className={cn(
                      "w-full sm:w-auto",  // Ajuste responsivo
                      !field.value ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white text-black cursor-not-allowed"  // Estilos condicionales
                    )}
                    placeholder={loading ? 'Generando número de serie...' : 'N° Serie'}  // Mostrar mensaje de carga
                    {...field}
                    value={field.value}  // Acepta el valor generado
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}  // Convierte a mayúsculas
                    disabled={isEquipoLoading || loading}  // Deshabilitar cuando está cargando o se está cargando el equipo
                  />
                </FormControl>
                {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}  {/* Icono de carga */}
              </div>
              <FormMessage className="text-left text-sm text-red-500" />
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
        <div className="col-span-2 flex justify-end ">
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
