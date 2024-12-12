import { useParams } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { getOrdenTrabajoByClienteId } from "@/api/ordenTrabajoService";
import Ordenes from "./Ordenes";
import Spinner from '../assets/tube-spinner.svg';
import { toast } from "sonner";

const ClienteOrdenesPage = () => {
    const { cliente_id } = useParams();

    const clienteId = cliente_id ? parseInt(cliente_id, 10) : undefined;

    const { data: clienteOrdenes = [], isLoading, error } = useQuery({
        queryKey: ['ordenTrabajoByCliente', clienteId],
        queryFn: () => getOrdenTrabajoByClienteId(clienteId as number),
        enabled: !!clienteId,
    });

    if (isLoading) return <div className="flex justify-center items-center h-28"><img src={Spinner} className="w-16 h-16" /></div>;
    if (error) return toast.error('Error al cargar las órdenes del cliente');

    return (
        <Ordenes ordenesProp={clienteOrdenes} />
    );
};

export default ClienteOrdenesPage;
