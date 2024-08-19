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
import { useForm, useWatch } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createProduct, getProductById, Product, updateProduct } from '@/api/productsService';
import { Loader2 } from 'lucide-react';
import { ProductCategory } from '@/api/productCategories';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";

const productSchema = z.object({
  id_catprod: z.number().min(1, 'Categoría es requerida'),
  nombreProducto: z.string().min(1, 'Nombre del producto es requerido'),
  codigoProducto: z.string().min(1, 'Código del producto es requerido'),
  precioSinIVA: z.number().min(1, 'El precio debe ser un número positivo mayor que cero'),
  iva: z.number().min(0, 'IVA es requerido'),
  precioFinal: z.number(),
  stock: z.number().min(1, 'El stock debe ser un número positivo mayor que cero'),
});

interface ProductFormProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  categorias: ProductCategory[]; 
  productId?: number; // ID del producto a editar, si existe
}

export default function ProductForm({ setIsOpen, categorias, productId }: ProductFormProps) {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id_catprod: 0,
      nombreProducto: '',
      codigoProducto: '',
      precioSinIVA: 0,
      iva: 12,  
      precioFinal: 0,
      stock: 0,
    },
  });
  const { data: producto, isLoading: isProductLoading, isError, error } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: () => productId ? getProductById(productId) : Promise.resolve({
      id_catprod: 0,
      nombreProducto: '',
      codigoProducto: '',
      precioSinIVA: 0,
      iva: 12,  
      precioFinal: 0,
      stock: 0,
    } as Product),
    enabled: !!productId,
  });
  useEffect(() => {
    if (producto) {
      form.reset({
        id_catprod: producto.id_catprod,
        nombreProducto: producto.nombreProducto,
        codigoProducto: producto.codigoProducto,
        precioSinIVA: producto.precioSinIVA,
        iva: Math.trunc(producto.iva),  
        precioFinal: producto.precioFinal,
        stock: producto.stock,
      });
    }
    if (isError) {
      console.error('Error fetching producto data:', error);
    }
  }, [producto, isError, error, form]);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto creado exitosamente');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error al crear el producto');
      console.error('Error de creación de producto:', error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto actualizado exitosamente');
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error('Error al actualizar el producto');
      console.error('Error de actualización de producto:', error);
    },
  });

  const precioSinIVA = useWatch({ control: form.control, name: 'precioSinIVA' });
  const iva = useWatch({ control: form.control, name: 'iva' });

  useEffect(() => {
    const precioSinIVANum = typeof precioSinIVA === 'number' ? precioSinIVA : parseFloat(precioSinIVA) || 0;
    const ivaNum = typeof iva === 'number' ? iva : parseFloat(iva) || 0;
  
    const nuevoPrecioFinal = precioSinIVANum + (precioSinIVANum * (ivaNum / 100));
    if (!isNaN(nuevoPrecioFinal)) {
      form.setValue('precioFinal', parseFloat(nuevoPrecioFinal.toFixed(2)));
    } else {
      form.setValue('precioFinal', 0); // Maneja casos en los que el cálculo no es válido
    }
  }, [precioSinIVA, iva, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    try {
      if (productId) {
        updateMutation.mutate({ ...values, id_producto: productId });
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
        <FormField
          name="id_catprod"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel htmlFor="id_catprod">
                Categoría <span className="text-red-500">*</span>
              </FormLabel>
              <div className='flex items-center gap-1'>
                <FormControl>
                  <select
                    id="id_catprod"
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-customGray shadow-sm cursor-pointer"
                    {...field}
                    value={field.value.toString()} 
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                    disabled={isProductLoading}
                  >
                    <option value="">Seleccionar Categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id_catprod} value={categoria.id_catprod}>
                        {categoria.nombreCat}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button 
                        className='rounded-md bg-customGreen text-white hover:bg-customGreenHover px-3'
                        type="button" 
                        >
                        <FontAwesomeIcon icon={faPlus}/> 
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className='bg-customGray text-white border-none font-semibold'>
                      <p>Añade una nueva categoría</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="nombreProducto"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel htmlFor="nombreProducto">
                Nombre del Producto <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="nombreProducto"
                  placeholder="Ingrese el nombre del producto"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="codigoProducto"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel htmlFor="codigoProducto">
                Código del Producto <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="codigoProducto"
                  placeholder="Ingrese el código del producto"
                  {...field}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())} 
                />
              </FormControl>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="stock"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel htmlFor="stock">
                Stock <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="stock"
                  type="number"
                  placeholder="Ingrese el stock disponible"
                  {...field}
                  min={0}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage className="text-left text-sm text-red-500" />
            </FormItem>
          )}
        />
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-4">Datos económicos</h2>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="precioSinIVA"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel htmlFor="precioSinIVA">
                    Precio sin IVA <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input
                        id="precioSinIVA"
                        type="number"
                        placeholder="Ingrese el precio sin IVA"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-left text-sm text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              name="iva"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel htmlFor="iva">
                    IVA (%) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <select
                      id="iva"
                      className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-customGray shadow-sm cursor-pointer"
                      {...field}
                      value={field.value.toString()}  // Asegúrate de que el valor sea string
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      disabled={isProductLoading}
                    >
                      <option value="0">0%</option>
                      <option value="10">10%</option>
                      <option value="12">12%</option>
                      <option value="15">15%</option>
                      <option value="21">21%</option>
                      <option value="27">27%</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-left text-sm text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              name="precioFinal"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel htmlFor="precioFinal">
                    Precio Final <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div
                      className={`flex items-center ${
                        field.value > 0 ? "text-black" : "text-gray-400"
                      }`}
                    >
                      <span className={`mr-2 ${field.value > 0 ? "text-black" : "text-gray-400"}`}>$</span>
                      <Input
                        id="precioFinal"
                        type="number"
                        min={0}
                        value={field.value}
                        readOnly
                        className={field.value > 0 ? "text-black" : "text-gray-400"}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-left text-sm text-red-500" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="col-span-2 flex justify-end">
          <Button type="submit" disabled={isLoading} className="bg-customGreen text-white hover:bg-customGreenHover">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Producto'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
