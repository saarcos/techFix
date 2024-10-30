import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { getOrdenTrabajoByEquipoId } from "@/api/ordenTrabajoService";
import Ordenes from "./Ordenes";
import Spinner from '../assets/tube-spinner.svg';
import { toast } from "sonner";

const EquipoOrdenesPage = () => {
    const { id_equipo } = useParams();

    const equipoId = id_equipo ? parseInt(id_equipo, 10) : undefined;

    const { data: equipoOrdenes = [], isLoading, error } = useQuery({
        queryKey: ['ordenTrabajoByEquipo', equipoId],
        queryFn: () => getOrdenTrabajoByEquipoId(equipoId as number),
        enabled: !!equipoId,
    });

    if (isLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
    if (error) return toast.error('Error al cargar las órdenes del equipo');

    return (
        <Ordenes ordenesProp={equipoOrdenes} />
    );
};

export default EquipoOrdenesPage;
