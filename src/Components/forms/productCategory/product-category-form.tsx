import { createProductCategory, getProductCategoryById, ProductCategory, updateProductCategory } from '@/api/productCategories';
import { Button } from '@/Components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/Components/ui/form';
import { Input } from '@/Components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const productCategorySchema = z.object({
    nombreCat: z.string().min(1, 'El nombre de la categoría es necesario')
});

interface ProductCategoryFormProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    productCategoryId?: number;
    setIsAddingCategory?: Dispatch<SetStateAction<boolean>>;
}

export default function ProductCategoryForm({ setIsOpen, productCategoryId, setIsAddingCategory }: ProductCategoryFormProps) {
    const form = useForm<z.infer<typeof productCategorySchema>>({
        resolver: zodResolver(productCategorySchema),
        defaultValues: {
            nombreCat: '',
        }
    });

    const { data: categoriaProducto, isError, error } = useQuery<ProductCategory>({
        queryKey: ['productCategory', productCategoryId],
        queryFn: () => productCategoryId ? getProductCategoryById(productCategoryId) : Promise.resolve({
            nombreCat: '',
        } as ProductCategory),
        enabled: !!productCategoryId
    });

    useEffect(() => {
        if (categoriaProducto) {
            form.reset({
                nombreCat: categoriaProducto.nombreCat
            });
        }
        if (isError) {
            console.error('Error fetching producto data:', error);
        }
    }, [categoriaProducto, form, isError, error]);

    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createProductCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productCategories'] });
            toast.success('Categoría de producto creada exitosamente');
            if (setIsAddingCategory) {
                setIsAddingCategory(false);
            }else{
                setIsOpen(false);
            }
        },
        onError: (error) => {
            toast.error('Error al crear la categoría del producto');
            console.error('Error de creación de la categoría de producto:', error);
        }
    });

    const updateMutation = useMutation({
        mutationFn: updateProductCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productCategories'] });
            toast.success('Categoría de producto actualizada exitosamente');
            setIsOpen(false);
        },
        onError: (error) => {
            toast.error('Error al actualizar la categoría del producto');
            console.error('Error de actualización de la categoría de producto:', error);
        }
    });

    const onSubmit = async (values: z.infer<typeof productCategorySchema>) => {
        if (productCategoryId) {
            updateMutation.mutate({ ...values, id_catprod: productCategoryId });
        } else {
            createMutation.mutate({ ...values });
        }
    };

    const isLoading = form.formState.isSubmitting;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                <FormField
                    name="nombreCat"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="col-span-2">
                            <FormLabel htmlFor="nombreCat">
                                Nombre <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    id="nombreCat"
                                    placeholder="Ingrese el nombre de la categoría"
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="col-span-2 flex justify-end">
                    <Button type="submit" disabled={isLoading} className="bg-customGreen text-white hover:bg-customGreenHover">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            'Guardar Categoría'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
