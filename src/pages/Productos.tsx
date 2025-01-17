import Spinner from '../assets/tube-spinner.svg';
import { toast } from 'sonner';
import { DataTable } from '@/Components/data-table';
import { Button } from '@/Components/ui/button';
import { columns } from '../tables/productos/columns';
import { PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { getProducts, Product } from '@/api/productsService';
import ProductForm from '@/Components/forms/productos/producto-form';
import { getProductCategories, ProductCategory } from '@/api/productCategories';
import { ResponsiveDialogExtended } from '@/Components/responsive-dialog-extended';
import ProductCategoryForm from '@/Components/forms/productCategory/product-category-form';

const Productos = () => {
  const dialogRef = useRef<HTMLButtonElement>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false); 

  const { data: products = [], isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const { data: productCategories = [], error: isProductCategoriesError } = useQuery<ProductCategory[]>({
    queryKey: ['productCategories'],
    queryFn: getProductCategories,
  });

  if (isLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
  if (error || isProductCategoriesError) return toast.error('Error al recuperar los datos');

  return (
    <div className="flex w-full flex-col bg-muted/40 mt-5">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card className="w-full max-w-9xl overflow-x-auto">
          <CardHeader>
            <CardTitle>Productos</CardTitle>
            <CardDescription>
              Administra los productos del taller.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveDialogExtended
              isOpen={isCreateOpen}
              setIsOpen={(open) => {
                setIsCreateOpen(open);
                if (!open) setIsAddingCategory(false); 
              }}
              title={isAddingCategory ? 'Nueva categoría de producto' : 'Nuevo producto'}  
              description={isAddingCategory ? 'Por favor, ingrese la información de la nueva categoría' : 'Por favor, ingresa la información solicitada'}
            >
              {isAddingCategory ? (
                <ProductCategoryForm setIsOpen={setIsCreateOpen} setIsAddingCategory={setIsAddingCategory} />
              ) : (
                <ProductForm
                  setIsOpen={setIsCreateOpen}
                  categorias={productCategories}
                  setIsAddingCategory={setIsAddingCategory} // Permite cambiar al formulario de categorías
                />
              )}
            </ResponsiveDialogExtended>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-8 gap-1 bg-customGreen hover:bg-customGreenHover"
                ref={dialogRef}
                onClick={() => {
                  setIsCreateOpen(true);
                  setIsAddingCategory(false); // Mostrar el formulario de producto por defecto
                }}
              >
                <PlusCircle className="h-3.5 w-3.5 text-black" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-black">
                  Nuevo producto
                </span>
              </Button>
            </div>
            <DataTable data={products ?? []} columns={columns} globalFilterColumn="nombreProducto" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Productos;
