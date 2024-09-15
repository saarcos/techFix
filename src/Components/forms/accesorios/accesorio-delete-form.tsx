import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/Components/ui/button';
import { Form } from '@/Components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteAccesorio } from '@/api/accesorioService';

const formSchema = z.object({
  accesorioId: z.number(),
});

interface DeleteFormProps {
    accesorioId: number;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteForm({ accesorioId, setIsOpen }: DeleteFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        accesorioId: accesorioId,
    },
  });
  const queryClient= useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteAccesorio,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['accesorios'] });
      toast.success('Accesorio eliminado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al eliminar el accesorio');
      console.error('Error al eliminar el accesorio:', error);
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async () => {
    try {
        deleteMutation.mutate(accesorioId);
        console.log(`Eliminando usuario con ID: ${accesorioId}`);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 sm:px-0 px-4"
      >
        <div className="w-full flex justify-center sm:space-x-6">
          <Button
            size="lg"
            variant="outline"
            disabled={isLoading}
            className="w-full hidden sm:block"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-400"
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
