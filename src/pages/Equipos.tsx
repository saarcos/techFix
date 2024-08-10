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
import {columns} from '../tables/equipos/columns'
import { Button } from "@/Components/ui/button";
import { FileDigit, PlusCircle } from "lucide-react";
const Equipos = () => {
  const { data: devices = [], isLoading, error } = useQuery<Equipo[]>({
    queryKey: ['devices'],
    queryFn: getEquipos,
  });
  if (isLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
  if (error ) return toast.error('Error al recuperar los datos');
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
          <div className="ml-auto flex items-center gap-2">
            <Button 
                  size="sm"
                  className="h-8 gap-1 bg-customGreen hover:bg-customGreenHover"
                  // ref={dialogRef}
                  // onClick={() => setIsCreateOpen(true)}  
                >
                <PlusCircle className="h-3.5 w-3.5 text-black" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap text-black">
                  Nuevo equipo
                </span>
            </Button>  
            <Button size="sm" variant="outline" className="h-8 gap-1">
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
  )
}

export default Equipos