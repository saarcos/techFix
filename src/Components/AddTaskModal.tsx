import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { ResponsiveDialogExtended } from './responsive-dialog-extended';
import { Input } from '@/Components/ui/input';
import { Tarea } from '@/api/tareaService'; // Suponiendo que esta función existe
import { useQuery } from '@tanstack/react-query';
import { getTareas } from '@/api/tareaService'; // Suponiendo que esta función existe para traer tareas desde la API

interface AddTaskModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onAddTask: (task: Tarea) => void; // Se pasa la tarea seleccionada
}

const AddTaskModal = ({ isOpen, setIsOpen, onAddTask }: AddTaskModalProps) => {
    // Traer tareas desde la base de datos
    const { data: tasks = [] } = useQuery<Tarea[]>({
        queryKey: ['tasks'],
        queryFn: getTareas, // Asumiendo que `getTareas` hace una solicitud a la API para obtener las tareas
    });

    return (
        <ResponsiveDialogExtended
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Seleccionar Tarea"
            description="Selecciona tareas para añadir a la orden de trabajo."
        >
            {/* Buscador */}
            <div className="mb-4">
                <Input
                    type="text"
                    className="border p-2 w-full rounded"
                    placeholder="Buscador"
                // Puedes añadir funcionalidad para filtrar tareas aquí si lo necesitas
                />
            </div>
            <div className="max-h-96 overflow-y-auto">

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Tiempo</TableHead>
                            <TableHead>Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id_tarea}>
                                <TableCell>{task.titulo}</TableCell>
                                <TableCell>{task.descripcion || 'Sin descripción'}</TableCell>
                                <TableCell>{task.tiempo} minutos</TableCell>
                                <TableCell>
                                    <Button
                                        className="bg-customGreen hover:bg-customGreenHover"
                                        onClick={() => onAddTask(task)}
                                    >
                                        Agregar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-6 flex justify-end">
                <Button onClick={() => setIsOpen(false)} variant="outline">
                    Cancelar
                </Button>
            </div>
        </ResponsiveDialogExtended>
    );
};

export default AddTaskModal;
