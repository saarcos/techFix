import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/Components/ui/button';
import { Form } from '@/Components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteProductCategory } from '@/api/productCategories';

const formSchema = z.object({
  productCategoryId: z.number(),
});

interface DeleteFormProps {
    productCategoryId: number;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteForm({ productCategoryId, setIsOpen }: DeleteFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        productCategoryId: productCategoryId,
    },
  });
  const queryClient= useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteProductCategory,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        toast.success('Categoría de producto eliminada exitosamente');
    },
    onError: (error) => {
      toast.error('Error al eliminar la categoría de producto');
      console.error('Error al eliminar el producto:', error);
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async () => {
    try {
        deleteMutation.mutate(productCategoryId);
        console.log(`Eliminando categoría de producto con ID: ${productCategoryId}`);
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
