import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/Components/ui/button';
import { Form } from '@/Components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteService } from '@/api/servicioService';

const formSchema = z.object({
  serviceId: z.number(),
});

interface DeleteFormProps {
    serviceId: number;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteForm({ serviceId, setIsOpen }: DeleteFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        serviceId: serviceId,
    },
  });
  const queryClient= useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services'] });
        toast.success('Servicio eliminado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al eliminar el servicio');
      console.error('Error al eliminar el servicio:', error);
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async () => {
    try {
        deleteMutation.mutate(serviceId);
        console.log(`Eliminando servicio con ID: ${serviceId}`);
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
