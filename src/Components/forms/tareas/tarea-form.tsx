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
import { Textarea } from '@/Components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { addProductosToTarea, addServiciosToTarea, createTarea, getTareaById, ServicioTarea, Tarea, updateTarea } from '@/api/tareaService';
import { ProductCombobox } from '@/Components/comboBoxes/producto-combobox';
import { getProducts, Product } from '@/api/productsService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk, faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getServices, Service } from '@/api/servicioService';
import { ServiceCombobox } from '@/Components/comboBoxes/servicio-combobox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { ProductoTarea } from '@/api/tareaService';

const formSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  tiempo: z.number().min(1, 'El tiempo debe ser un número positivo mayor que cero'),
  descripcion: z.string().optional(),
  productos: z.array(
    z.object({
      id_producto: z.number(),
      cantidad: z.number().min(1, 'La cantidad debe ser al menos 1'),
    })
  ).optional(), // Hacemos que productos sea opcional
  servicios: z.array(z.object({ id_servicio: z.number() })).optional(), // Hacemos que servicios sea opcional
});
interface TareaFormProps {
  tareaId?: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setIsCreatingTask: Dispatch<SetStateAction<boolean>>;
}

export default function TareaForm({ tareaId, setIsOpen, setIsCreatingTask }: TareaFormProps) {
  const [selectedProducts, setSelectedProducts] = useState<{ id_producto: number; nombre: string; cantidad: number }[]>([]);
  const [selectedServices, setSelectedServices] = useState<{ id_servicio: number; nombre: string }[]>([]);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: getServices,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: '',
      tiempo: 0,
      descripcion: '',
      productos: [],
      servicios: [],
    },
  });

  const queryClient = useQueryClient();
  const { data: tarea, isLoading: isTareaLoading, isError, error } = useQuery({
    queryKey: ['tarea', tareaId],
    queryFn: () => (tareaId ? getTareaById(tareaId) : Promise.resolve({ id_tarea: 0, titulo: '', tiempo: 0, descripcion: '', productos: [], servicios: [] } as Tarea)),
    enabled: !!tareaId,
  });

  const updateMutation = useMutation({
    mutationFn: updateTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      // toast.success('Tarea actualizada exitosamente');
      setIsCreatingTask(false);
    },
    onError: (error) => {
      toast.error('Error al actualizar la tarea');
      console.error('Error de actualización de tarea:', error);
      setIsOpen(false);
    },
  });

  const createMutation = useMutation({
    mutationFn: createTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      // toast.success('Tarea creada exitosamente');
      setIsCreatingTask(false);
    },
    onError: (error) => {
      toast.error('Error al crear la tarea');
      console.error('Error de creación de tarea:', error);
      setIsOpen(false);
    },
  });

  useEffect(() => {
    if (tarea) {
      // Llenar los campos de título, tiempo y descripción
      form.reset({
        titulo: tarea.titulo,
        tiempo: tarea.tiempo,
        descripcion: tarea.descripcion,
      });

      // Mapear los productos de la tarea a la estructura requerida
      const mappedProducts = tarea.productos.map((productoTarea: ProductoTarea) => ({
        id_producto: productoTarea.id_producto,
        nombre: productoTarea.producto.nombreProducto, // Ajusta el campo según tu estructura de producto
        cantidad: productoTarea.cantidad,
      }));
      setSelectedProducts(mappedProducts);

      // Mapear los servicios de la tarea a la estructura requerida
      const mappedServices = tarea.servicios.map((servicioTarea: ServicioTarea) => ({
        id_servicio: servicioTarea.id_servicio,
        nombre: servicioTarea.servicio.nombre, // Ajusta el campo según tu estructura de servicio
      }));
      setSelectedServices(mappedServices);
    }

    if (isError) {
      console.error('Error fetching tarea data:', error);
    }
  }, [tarea, isError, error, form, isTareaLoading]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let id_tarea;

      if (tareaId) {
        // 1. Actualizar la tarea existente (incluyendo productos y servicios)
        const tareaPayload = {
          titulo: values.titulo,
          tiempo: values.tiempo,
          descripcion: values.descripcion ?? '', // Si es undefined, se envía una cadena vacía
          productos: selectedProducts.map(({ id_producto, cantidad }) => ({
            id_producto,
            cantidad,
          })),
          servicios: selectedServices.map(({ id_servicio }) => ({
            id_servicio,
          })),
        };
        console.log("Payload:", tareaPayload)

        const updatedTareaResponse = await updateMutation.mutateAsync({
          id_tarea: tareaId,
          ...tareaPayload,
        });
        id_tarea = updatedTareaResponse.id_tarea;
      } else {
        // 1. Crear la nueva tarea
        const tareaPayload = {
          titulo: values.titulo,
          tiempo: values.tiempo,
          descripcion: values.descripcion ?? '', // Si es undefined, se envía una cadena vacía
        };
        const newTareaResponse = await createMutation.mutateAsync(tareaPayload);
        id_tarea = newTareaResponse.id_tarea;
        // 2. Añadir productos a la tarea (si los hay)
        if (selectedProducts.length > 0) {
          await addProductosToTarea({
            id_tarea,  // Enviamos id_tarea en el cuerpo
            productos: selectedProducts.map(({ id_producto, cantidad }) => ({
              id_producto,
              cantidad,
            })),
          });
        }

        // 3. Añadir servicios a la tarea (si los hay)
        if (selectedServices.length > 0) {
          await addServiciosToTarea({
            id_tarea,  // Enviamos id_tarea en el cuerpo
            servicios: selectedServices.map(({ id_servicio }) => ({
              id_servicio,
            })),
          });
        }
      }
      toast.success(tareaId ? 'Tarea actualizada con éxito' : 'Tarea creada con éxito');
      setIsCreatingTask(false); // Cerrar el modal o formulario
    } catch (error) {
      toast.error(tareaId ? 'Error al actualizar la tarea' : 'Error al crear la tarea');
      console.error(error);
    }
  };

  // Buscar el nombre del producto basado en el id
  const getProductName = (id_producto: number) => {
    const product = products.find((prod) => prod.id_producto === id_producto);
    return product ? product.nombreProducto : 'Producto no encontrado';
  };

  // Buscar el nombre del servicio basado en el id
  const getServiceName = (id_servicio: number) => {
    const service = services.find((serv) => serv.id_servicio === id_servicio);
    return service ? service.nombre : 'Servicio no encontrado';
  };

  const addProduct = (id_producto: number, cantidad: number) => {
    const nombre = getProductName(id_producto);
    setSelectedProducts((prevProducts) => [
      ...prevProducts.filter((prod) => prod.id_producto !== id_producto),
      { id_producto, nombre, cantidad },
    ]);
  };

  const addService = (id_servicio: number) => {
    const nombre = getServiceName(id_servicio);
    setSelectedServices((prevServices) => [
      ...prevServices.filter((serv) => serv.id_servicio !== id_servicio),
      { id_servicio, nombre },
    ]);
  };

  const updateProductQuantity = (id_producto: number, newQuantity: number) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id_producto === id_producto ? { ...product, cantidad: newQuantity } : product
      )
    );
  };

  const removeService = (id_servicio: number) => {
    setSelectedServices((prevServices) =>
      prevServices.filter((service) => service.id_servicio !== id_servicio)
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Título y tiempo */}
        <div className="grid grid-cols-3 gap-4">
          <FormField
            name="titulo"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel htmlFor="titulo">Título <span className="text-red-500"><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3' /></span></FormLabel>
                <FormControl>
                  <Input id="titulo" placeholder="Ingrese el título de la tarea" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="tiempo"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 lg:col-span-1">
                <FormLabel htmlFor="tiempo">Tiempo estimado <span className='text-red-500'><FontAwesomeIcon icon={faAsterisk} className='w-3 h-3' /></span></FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input
                      id="tiempo"
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))} // Conversión a número

                    />
                    <div className="ml-1 border border-gray-300 px-2 py-[7px] rounded">
                      <span className="text-sm text-gray-500">Minutos</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Descripción */}
        <FormField
          name="descripcion"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="descripcion">Descripción</FormLabel>
              <FormControl>
                <Textarea id="descripcion" placeholder="Ingrese la descripción de la tarea" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Productos */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold">Productos</h2>
          <div className="flex items-center gap-2 mt-2">
            <ProductCombobox
              field={{ value: '', onChange: (id_producto: number) => addProduct(id_producto, 1) }}
              products={products}
            />

          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500">
                    No hay productos seleccionados.
                  </TableCell>
                </TableRow>
              ) : (
                selectedProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>{product.nombre}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          className="h-8 w-8 bg-customGreen hover:bg-customGreenHover rounded-full"
                          onClick={() => updateProductQuantity(product.id_producto, Math.max(1, product.cantidad - 1))} // Evitar que sea menor a 1
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </Button>
                        <Input
                          type="number"
                          value={product.cantidad}
                          min={1}
                          onFocus={(e) => e.target.select()} // Selecciona el texto al hacer foco
                          onChange={(e) =>
                            updateProductQuantity(product.id_producto, Number(e.target.value))
                          }
                          className="w-16 text-center"
                        />
                        <Button
                          type="button"
                          className="h-8 w-8 bg-customGreen hover:bg-customGreenHover rounded-full"
                          onClick={() => updateProductQuantity(product.id_producto, product.cantidad + 1)}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        className="text-red-500 rounded-md p-2 transition-all duration-75 hover:bg-neutral-100 bg-white"
                        onClick={() =>
                          setSelectedProducts((prev) => prev.filter((p) => p.id_producto !== product.id_producto))
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-1" /> Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Servicios */}
        <div className="col-span-2">
          <h2 className="text-lg font-semibold">Servicios</h2>
          <div className="flex items-center gap-2">
            <ServiceCombobox
              field={{ value: '', onChange: (id_servicio: number) => addService(id_servicio) }}
              services={services}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-gray-500">
                    No hay servicios seleccionados.
                  </TableCell>
                </TableRow>
              ) : (
                selectedServices.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell>{service.nombre}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        className="text-red-500 rounded-md p-2 transition-all duration-75 hover:bg-neutral-100 bg-white"
                        onClick={() => removeService(service.id_servicio)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-1" /> Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Botones */}
        <div className="flex justify-between">
          <Button type='button' variant="outline" onClick={() => setIsCreatingTask(false)}>Cancelar</Button>
          <Button
            type="submit"
            className={`${isLoading || isTareaLoading
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
              : 'bg-customGreen text-white hover:bg-customGreenHover'
              } px-4 py-2 rounded-md transition-all duration-200 ease-in-out`}
          >
            {isLoading || isTareaLoading ? (
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
