import { useState } from 'react';
import IconMenu from '@/Components/icon-menu';
import { ResponsiveDialog } from '@/Components/responsive-dialog';
import { Button } from '@/Components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal, SquarePen, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Product } from '@/api/productsService';
import ProductForm from '@/Components/forms/productos/producto-form';
import { getProductCategories, ProductCategory } from '@/api/productCategories';
import DeleteForm from '@/Components/forms/productos/product-delete-form';
import { ResponsiveDialogExtended } from '@/Components/responsive-dialog-extended';
import ProductCategoryForm from '@/Components/forms/productCategory/product-category-form';

interface DataTableRowActionsProps {
  row: Row<Product>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false); 
  const { data: productCategories = [], error: isProductCategoriesError } = useQuery<ProductCategory[]>({
    queryKey: ['productCategories'],
    queryFn: getProductCategories,
  });
  if (isProductCategoriesError) return toast.error('Error al recuperar los datos');

  const productId = row.original.id_producto;
  return (
    <>
      <ResponsiveDialogExtended
              isOpen={isEditOpen}
              setIsOpen={(open) => {
                setIsEditOpen(open);
                if (!open) setIsAddingCategory(false); 
              }}
              title={isAddingCategory ? 'Nueva categoría de producto' : `Editar información de ${row.original.nombreProducto}`}  
              description={isAddingCategory ? 'Por favor, ingrese la información de la nueva categoría' : 'Por favor, ingresa la información solicitada'}
            >
              {isAddingCategory ? (
                <ProductCategoryForm setIsOpen={setIsEditOpen} setIsAddingCategory={setIsAddingCategory} />
              ) : (
                <ProductForm
                  productId={productId}
                  setIsOpen={setIsEditOpen}
                  categorias={productCategories}
                  setIsAddingCategory={setIsAddingCategory} // Permite cambiar al formulario de categorías
                />
              )}
      </ResponsiveDialogExtended>
      <ResponsiveDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title={`Eliminar del sistema a ${row.original.nombreProducto}`}
        description="¿Estás seguro de que deseas continuar? Esta acción no se puede deshacer."
      >
        <DeleteForm productId={productId} setIsOpen={setIsDeleteOpen} />
      </ResponsiveDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Desplegar menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px] z-50">
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
            <button
              onClick={() => {
                setIsEditOpen(true);
              }}
              className="w-full justify-start flex rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
            >
              <IconMenu text="Modificar" icon={<SquarePen className="h-4 w-4" />} />
            </button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group flex w-full items-center justify-between  text-left p-0 text-sm font-base text-neutral-500 ">
            <button
              onClick={() => {
                setIsDeleteOpen(true);
              }}
              className="w-full justify-start flex text-red-500 rounded-md p-2 transition-all duration-75 hover:bg-neutral-100"
            >
              <IconMenu text="Eliminar" icon={<Trash2 className="h-4 w-4" />} />
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
