import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/Components/ui/button';
import { Form } from '@/Components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteBrand } from '@/api/marcasService';

const formSchema = z.object({
    brandId: z.number(),
});

interface DeleteFormProps {
    brandId: number;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteOrdenForm({ brandId, setIsOpen }: DeleteFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            brandId: brandId,
        },
    });
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: deleteBrand,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
            toast.success('Marca eliminada exitosamente')
        },
        onError: (error) => {
            toast.error('Error al eliminar la marca');
            console.error('Error al eliminar la marca:', error);
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async () => {
        if (brandId <= 0) {
            toast.error('El ID de la marca no es válido.');
            return;
        }
        try {
            deleteMutation.mutate(brandId);
            console.log(`Eliminando marca con ID: ${brandId}`);
            setIsOpen(false);
        } catch (error) {
            console.error('Error al intentar eliminar la marca:', error);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 px-4 sm:px-0"
            >
                <p className="text-center text-gray-600"></p>
                <div className="w-full flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                        size="lg"
                        variant="outline"
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                        type="button"
                        onClick={() => setIsOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        size="lg"
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-red-500 hover:bg-red-400 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Eliminando
                            </>
                        ) : (
                            <span>Eliminar</span>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
