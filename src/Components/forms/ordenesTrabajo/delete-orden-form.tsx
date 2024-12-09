import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/Components/ui/button';
import { Form } from '@/Components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteOrdenTrabajo } from '@/api/ordenTrabajoService';
import { CustomToast } from '@/Components/CustomToast';

const formSchema = z.object({
    orderId: z.number(),
});

interface DeleteFormProps {
    orderId: number;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteOrdenForm({ orderId, setIsOpen }: DeleteFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            orderId: orderId,
        },
    });
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: deleteOrdenTrabajo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ordenesTrabajo'] });
            CustomToast({
                message:
                    "Orden de trabajo eliminada exitosamente",
                type: "success",
            });
        },
        onError: (error) => {
            toast.error('Error al eliminar la orden de trabajo');
            console.error('Error al eliminar la orden de trabajo:', error);
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async () => {
        if (orderId <= 0) {
            toast.error('El ID de la orden no es válido.');
            return;
        }

        try {
            deleteMutation.mutate(orderId);
            console.log(`Eliminando orden con ID: ${orderId}`);
            setIsOpen(false);
        } catch (error) {
            console.error('Error al intentar eliminar la orden:', error);
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
