import Spinner from '../assets/tube-spinner.svg';
import { toast } from 'sonner';
import { Button } from '@/Components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { getExistenciasByAlmacenId, updateExistencia } from '@/api/existenciasService';
import { getAlmacenById } from '@/api/almacenesService';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/Components/ui/input';
import ExistenciaForm from '@/Components/forms/inventarios/inventario-form';
import ProductForm from '@/Components/forms/productos/producto-form';
import ProductCategoryForm from '@/Components/forms/productCategory/product-category-form';
import { getProductCategories, ProductCategory } from '@/api/productCategories';
import { ResponsiveDialogExtended } from '@/Components/responsive-dialog-extended';
import { ResponsiveDialog } from '@/Components/responsive-dialog';
import DeleteForm from '@/Components/forms/inventarios/inventario-delete-form';

const Inventario = () => {
    const navigate = useNavigate()
    const { id_almacen } = useParams();
    const almacenId = id_almacen ? parseInt(id_almacen, 10) : null;
    const dialogRef = useRef<HTMLButtonElement>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [isDeletingExistencia, setIsDeletingExistencia] = useState(false);
    const [selectedExistenciaId, setSelectedExistenciaId] = useState<number | null>(null); // Define el ID seleccionado
    const queryClient = useQueryClient();
    const [editedStock, setEditedStock] = useState<{ [key: number]: number }>({});

    const { data: existencias, isLoading, isError } = useQuery({
        queryKey: ['existencias', almacenId],
        queryFn: () => almacenId ? getExistenciasByAlmacenId(almacenId) : Promise.resolve(null),
        enabled: !!almacenId,
    });
    const { data: almacen, isLoading: isAlmacenLoading } = useQuery({
        queryKey: ['almacen', almacenId],
        queryFn: () => almacenId ? getAlmacenById(almacenId) : Promise.resolve(null),
        enabled: !!almacenId,
    });
    const { data: productCategories = [] } = useQuery<ProductCategory[]>({
        queryKey: ['productCategories'],
        queryFn: getProductCategories,
    });

    const mutation = useMutation({
        mutationFn: (data: { id_existencias: number; id_almacen: number; id_producto: number; cantidad: number }) => updateExistencia(data),
        onSuccess: () => {
            toast.success("Inventario actualizado correctamente");
            queryClient.invalidateQueries({ queryKey: ['existencias', almacenId] });
        },
        onError: () => {
            toast.error("Error al actualizar el inventario");
        },
    });

    const handleStockChange = (id_existencias: number, cantidad: number) => {
        const validatedCantidad = isNaN(cantidad) || cantidad < 0 ? 0 : cantidad;
        setEditedStock((prev) => ({ ...prev, [id_existencias]: validatedCantidad }));
    };


    const incrementStock = (id_existencias: number, currentQuantity: number) => {
        handleStockChange(id_existencias, currentQuantity + 1);
    };

    const decrementStock = (id_existencias: number, currentQuantity: number) => {
        handleStockChange(id_existencias, Math.max(0, currentQuantity - 1));
    };

    const handleSaveChanges = () => {
        if (existencias) {
            existencias.forEach((existencia) => {
                const newCantidad = editedStock[existencia.id_existencias];
                if (newCantidad !== undefined && newCantidad !== existencia.cantidad) {
                    mutation.mutate({
                        id_existencias: existencia.id_existencias,
                        id_almacen: existencia.id_almacen,
                        id_producto: existencia.id_producto,
                        cantidad: newCantidad,
                    });
                }
            });
        }
        setEditedStock({});
    };
    const openDeleteDialog = (id_existencias: number) => {
        setSelectedExistenciaId(id_existencias);
        setIsDeletingExistencia(true);
    };
    
    if (isLoading || isAlmacenLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
    if (isError) return toast.error('Error al recuperar los datos');

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 mt-5">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <Card className="w-full max-w-9xl overflow-x-auto">
                    <CardHeader>
                        <CardTitle>Inventario de {almacen?.nombre}</CardTitle>
                        <CardDescription>
                            Administra el stock de los productos del {almacen?.nombre}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveDialogExtended
                           isOpen={isCreateOpen}
                           setIsOpen={(open) => {
                            setIsCreateOpen(open);
                            if (!open) {
                                setIsAddingProduct(false);
                                setIsAddingCategory(false);
                            }
                        }}
                            title={isAddingCategory ? "Nueva categoría de producto" : isAddingProduct ? "Nuevo producto" : "Agregar producto"}
                            description={isAddingCategory ? "Por favor, ingrese la información de la nueva categoría" : "Por favor, ingresa la información solicitada"}
                        >
                            {isAddingCategory ? (
                                <ProductCategoryForm setIsOpen={setIsCreateOpen} setIsAddingCategory={setIsAddingCategory} />
                            ) : isAddingProduct ? (
                                <ProductForm
                                    setIsOpen={setIsCreateOpen}
                                    categorias={productCategories}
                                    setIsAddingCategory={setIsAddingCategory}
                                />
                            ) : (
                                <ExistenciaForm id_almacen={almacen?.id_almacen || 0} setIsOpen={setIsCreateOpen} setIsAddingProduct={setIsAddingProduct} />
                            )}
                        </ResponsiveDialogExtended>
                        <ResponsiveDialog
                            isOpen={isDeletingExistencia}
                            setIsOpen={setIsDeletingExistencia}
                            title="Eliminar existencia"
                            description='¿Estás seguro de que deseas continuar? Esta acción no se puede deshacer.'
                        >
                            {selectedExistenciaId && (
                                <DeleteForm existenciaId={selectedExistenciaId} setIsOpen={setIsDeletingExistencia} />
                            )}
                        </ResponsiveDialog>
                        <Button
                            size="sm"
                            className="h-8 gap-1 bg-customGreen hover:bg-customGreenHover mb-4"
                            ref={dialogRef}
                            onClick={() => {
                                setIsCreateOpen(true);
                                setIsAddingProduct(false); // Asegura que al abrir el modal, `ExistenciaForm` sea el formulario predeterminado
                                setIsAddingCategory(false);
                            }}                        >
                            <PlusCircle className="h-3.5 w-3.5 text-black" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-black">
                                Agregar productos al almacén
                            </span>
                        </Button>
                        <div className="overflow-x-auto w-full rounded-md border">
                            <Table className='min-w-full divide-y divide-gray-200'>
                                <TableHeader className='bg-gray-100'>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead className="hidden sm:table-cell">Código</TableHead>
                                        <TableHead>Cantidad en Stock</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className='bg-white divide-y divide-gray-200'>
                                    {existencias?.length === 0 ? (
                                        <TableRow className='hover:cursor-pointer'>
                                            <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                                                No hay existencias en este almacén.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        existencias?.map((existencia) => (
                                            <TableRow key={existencia.id_existencias} className='hover:cursor-pointer'>
                                                <TableCell>{existencia.producto?.nombreProducto}</TableCell>
                                                <TableCell className='hidden sm:table-cell'>{existencia.producto?.codigoProducto}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            onClick={() => decrementStock(existencia.id_existencias, editedStock[existencia.id_existencias] ?? existencia.cantidad)}
                                                            className="h-8 w-8 bg-customGreen hover:bg-customGreenHover rounded-full text-black"
                                                        >
                                                            <FontAwesomeIcon icon={faMinus} />
                                                        </Button>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            value={editedStock[existencia.id_existencias] ?? existencia.cantidad}
                                                            onChange={(e) => handleStockChange(existencia.id_existencias, parseInt(e.target.value, 10) || 0)}
                                                            className="w-16 text-center"
                                                        />
                                                        <Button
                                                            type="button"
                                                            onClick={() => incrementStock(existencia.id_existencias, editedStock[existencia.id_existencias] ?? existencia.cantidad)}
                                                            className="h-8 w-8 bg-customGreen hover:bg-customGreenHover rounded-full text-black"
                                                        >
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        className="h-8 w-8 bg-customGreen hover:bg-customGreen/50 hover:text-black rounded-full text-white"
                                                        onClick={() => openDeleteDialog(existencia.id_existencias)} // Abre el diálogo de confirmación
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="mr-2"
                                onClick={() => navigate('/taller/almacenes')}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSaveChanges}
                                className="bg-customGreen hover:bg-customGreenHovertext-white"
                                disabled={Object.keys(editedStock).length === 0}
                            >
                                Guardar cambios
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default Inventario;
