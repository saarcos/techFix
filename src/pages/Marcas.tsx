import Spinner from '../assets/tube-spinner.svg';
import { toast } from 'sonner';
import { DataTable } from '@/Components/data-table';
import { Button } from '@/Components/ui/button';
import { columns } from '../tables/marcas/columns';
import { PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import MarcaForm from '@/Components/forms/marcas/marca-form';
import { Brand, getBrands } from '@/api/marcasService';
import { ResponsiveDialog } from '@/Components/responsive-dialog';

const Marcas = () => {
    const dialogRef = useRef<HTMLButtonElement>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const { data: brands = [], isLoading, error } = useQuery<Brand[]>({
        queryKey: ['brands'],
        queryFn: getBrands,
    });

    if (isLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
    if (error) return toast.error('Error al recuperar los datos');

    return (
        <div className="flex w-full flex-col bg-muted/40 mt-5">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <Card className="w-full max-w-9xl overflow-x-auto">
                    <CardHeader>
                        <CardTitle>Marcas</CardTitle>
                        <CardDescription>
                            Administra las marcas de los equipos que con los que se trabajará en el taller.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveDialog
                            isOpen={isCreateOpen}
                            setIsOpen={setIsCreateOpen}
                            title={`Nuevo modelo`}
                            description='Por favor, ingresa la información solicitada'
                        >
                            <MarcaForm setIsOpen={setIsCreateOpen} />
                        </ResponsiveDialog>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                className="h-8 gap-1 bg-customGreen hover:bg-customGreenHover"
                                ref={dialogRef}
                                onClick={() => {
                                    setIsCreateOpen(true);
                                }}
                            >
                                <PlusCircle className="h-3.5 w-3.5 text-black" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-black">
                                    Nueva marca
                                </span>
                            </Button>
                        </div>
                        <DataTable data={brands ?? []} columns={columns} globalFilterColumn="nombre" />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default Marcas;