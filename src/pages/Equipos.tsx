import * as XLSX from "xlsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { DataTable } from "@/Components/data-table";
import { Equipo, getEquipos } from "@/api/equipoService";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import Spinner from '../assets/tube-spinner.svg';
import { columns } from '../tables/equipos/columns';
import { Button } from "@/Components/ui/button";
import { FileDigit, PlusCircle } from "lucide-react";
import { useState } from "react";
import EquipoForm from "@/Components/forms/equipos/equipo-form";
import { ResponsiveDialogExtended } from "@/Components/responsive-dialog-extended";
import { Brand, getBrands } from "@/api/marcasService";
import { getModels, Model } from "@/api/modeloService";
import { Client, getClients } from "@/api/clientService";
import { DeviceType, getDeviceTypes } from "@/api/tipoEquipoService";
import BrandModelForm from "@/Components/forms/brandModel/brand-model-from";
import TipoEquipoForm from "@/Components/forms/tiposEquipo/tipo-equipo-form";

const Equipos = () => {

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isAddingBrand, setIsAddingBrand] = useState(false); 
    const [isAddingTipoEquipo, setIsAddingTipoEquipo] = useState(false); 

    const { data: devices = [], isLoading, error } = useQuery<Equipo[]>({
        queryKey: ['devices'],
        queryFn: getEquipos,
    });
    const { data: marcas = [], isLoadingError: marcasError } = useQuery<Brand[]>({
        queryKey: ['brands'],
        queryFn: getBrands,
    });
    const { data: modelos = [], isLoadingError: modelsError } = useQuery<Model[]>({
        queryKey: ['models'],
        queryFn: getModels,
    });
    const { data: propietarios = [], isLoadingError: ownersError } = useQuery<Client[]>({
        queryKey: ['owners'],
        queryFn: getClients,
    });
    const { data: tiposEquipo = [], isLoadingError: deviceTypesError } = useQuery<DeviceType[]>({
        queryKey: ['deviceTypes'],
        queryFn: getDeviceTypes,
    });

    if (isLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
    if (error || marcasError || modelsError || ownersError || deviceTypesError) return toast.error('Error al recuperar los datos');

    const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(devices.map(device => ({
            "Número de Serie": device.nserie,
            "Cliente": `${device.cliente.nombre} ${device.cliente.apellido}`,
            "Tipo de Equipo": device.tipoEquipo.nombre,
            "Marca": device.modelo.marca.nombre,
            "Modelo": device.modelo.nombre,
            "Descripción": device.descripcion,
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Equipos");

        XLSX.writeFile(workbook, "Equipos.xlsx");
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 mt-5">
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <Card className="w-full max-w-9xl overflow-x-auto">
                    <CardHeader>
                        <CardTitle>Equipos</CardTitle>
                        <CardDescription>
                            Administra los equipos que ingresaron al taller.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveDialogExtended
                            isOpen={isCreateOpen}
                            setIsOpen={(open) => {
                                setIsCreateOpen(open);
                                if (!open) {
                                    setIsAddingBrand(false);
                                    setIsAddingTipoEquipo(false);
                                }
                            }}
                            title={
                                isAddingBrand ? 'Nueva marca y modelo' :
                                    isAddingTipoEquipo ? 'Nuevo tipo de equipo' :
                                        'Nuevo equipo'
                            }
                            description={
                                isAddingBrand ? 'Por favor, ingrese la información de la nueva marca y modelo' :
                                    isAddingTipoEquipo ? 'Por favor, ingrese la información del nuevo tipo de equipo' :
                                        'Por favor, ingresa la información solicitada'
                            }
                        >
                            {isAddingBrand ? (
                                <BrandModelForm setIsOpen={setIsCreateOpen} setIsAddingBrand={setIsAddingBrand} />
                            ) : isAddingTipoEquipo ? (
                                <TipoEquipoForm setIsOpen={setIsCreateOpen} setIsAddingTipoEquipo={setIsAddingTipoEquipo} />
                            ) : (
                                <EquipoForm
                                    setIsOpen={setIsCreateOpen}
                                    brands={marcas}
                                    models={modelos}
                                    owners={propietarios}
                                    deviceTypes={tiposEquipo}
                                    setIsAddingBrand={setIsAddingBrand}
                                    setIsAddingTipoEquipo={setIsAddingTipoEquipo}
                                />
                            )}
                        </ResponsiveDialogExtended>
                        <div className="ml-auto flex items-center gap-2">
                            <Button
                                size="sm"
                                className="h-8 gap-1 bg-customGreen hover:bg-customGreenHover"
                                onClick={() => setIsCreateOpen(true)}
                            >
                                <PlusCircle className="h-3.5 w-3.5 text-black" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-black">
                                    Nuevo equipo
                                </span>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 gap-1"
                                onClick={handleExport} // Exportar datos al hacer clic
                            >
                                <FileDigit className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Exportar
                                </span>
                            </Button>
                        </div>
                        <DataTable data={devices ?? []} columns={columns} globalFilterColumn='nserie' />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

export default Equipos;
