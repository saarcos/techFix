import { Dispatch, SetStateAction, useEffect } from 'react';
import { Button } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createExistencia, updateExistencia, getExistenciaById } from '@/api/existenciasService';
import { getProducts, Product } from '@/api/productsService';
import { Loader2 } from 'lucide-react';
import { ProductCombobox } from '@/Components/comboBoxes/producto-combobox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const existenciaSchema = z.object({
    id_producto: z.number().min(1, 'Seleccione un producto'),
    cantidad:  z.preprocess(
        (value) => parseFloat(value as string),
        z.number().min(1, 'la cantidad debe ser un número positivo')
      ),
});

interface ExistenciaFormProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    id_almacen: number;
    id_existencias?: number;
    setIsAddingProduct: Dispatch<SetStateAction<boolean>>;

}

export default function ExistenciaForm({ setIsOpen, id_almacen, id_existencias, setIsAddingProduct }: ExistenciaFormProps) {
    const form = useForm<z.infer<typeof existenciaSchema>>({
        resolver: zodResolver(existenciaSchema),
        defaultValues: {
            id_producto: 0,
            cantidad: 1,
        },
    });

    const queryClient = useQueryClient();

    // Fetch product data for ProductCombobox
    const { data: productos = [] } = useQuery<Product[]>({
        queryKey: ['productos'],
        queryFn: getProducts,
    });
    const { data: existencia, isLoading: isExistenciaLoading } = useQuery({
        queryKey: ['existencia', id_existencias],
        queryFn: () => id_existencias ? getExistenciaById(id_existencias) : Promise.resolve(null),
        enabled: !!id_existencias,
    });

    const createMutation = useMutation({
        mutationFn: createExistencia,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['existencias'] });
            toast.success('Existencia creada exitosamente');
            setIsOpen(false);
        },
        onError: (error) => {
            toast.error('Error al crear la existencia');
            console.error('Error de creación de existencia:', error);
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateExistencia,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['existencias'] });
            toast.success('Existencia actualizada exitosamente');
            setIsOpen(false);
        },
        onError: (error) => {
            toast.error('Error al actualizar la existencia');
            console.error('Error de actualización de existencia:', error);
        },
    });


    const onSubmit = async (values: z.infer<typeof existenciaSchema>) => {
        const existenciaData = {
            id_almacen,
            id_producto: values.id_producto,
            cantidad: values.cantidad,
            ...(id_existencias && { id_existencias }) // Solo incluye id_existencias si está definido
        };

        try {
            if (id_existencias) {
                updateMutation.mutate(existenciaData as { id_existencias: number; id_almacen: number; id_producto: number; cantidad: number });
            } else {
                createMutation.mutate({ id_almacen, ...values });
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (existencia) {
            form.reset({
                id_producto: existencia.id_producto,
                cantidad: existencia.cantidad,
            });
        }
    }, [existencia, form]);

    const isLoading = form.formState.isSubmitting || isExistenciaLoading;

    const incrementQuantity = () => {
        form.setValue('cantidad', form.getValues('cantidad') + 1);
    };

    const decrementQuantity = () => {
        const currentQuantity = form.getValues('cantidad');
        if (currentQuantity > 1) {
            form.setValue('cantidad', currentQuantity - 1);
        }
    };
    const handleBlur = () => {
        const currentQuantity = form.getValues('cantidad');
        if (!currentQuantity || isNaN(currentQuantity) || currentQuantity < 1) {
            form.setValue('cantidad', 1);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                <FormField
                    name="id_producto"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="id_producto">
                                Seleccionar Producto <span className="text-red-500">*</span>
                            </FormLabel>
                                <FormControl>
                                    <ProductCombobox field={field} products={productos} />
                                </FormControl>
                                <FormMessage className="text-left text-sm text-red-500" />

                        </FormItem>
                    )}
                />
                <FormField
                    name="cantidad"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="cantidad">
                                Cantidad <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        onClick={decrementQuantity}
                                        className="h-8 w-8 bg-customGreen hover:bg-customGreenHover rounded-full text-black"
                                    >
                                        <FontAwesomeIcon icon={faMinus} />
                                    </Button>
                                    <Input
                                        id="cantidad"
                                        type="number"
                                        min={1}
                                        {...field}
                                        className="w-16 text-center"
                                        onBlur={handleBlur} 
                                    />
                                    <Button
                                        type="button"
                                        onClick={incrementQuantity}
                                        className="h-8 w-8 bg-customGreen hover:bg-customGreenHover rounded-full text-black"
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage className="text-left text-sm text-red-500" />
                        </FormItem>
                    )}
                />
                <div className="col-span-2 flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        className="mr-2"
                        onClick={()=>setIsAddingProduct(true)}
                    >
                        Nuevo producto
                    </Button>
                    <Button type="submit" disabled={isLoading} className="bg-customGreen text-white hover:bg-customGreenHover">
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
    );
}
