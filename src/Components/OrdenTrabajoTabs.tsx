import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from '@/Components/ui/button';
import { PlusCircle, ImagePlus, Clock, UserPlus, X } from "lucide-react";
import { TareaOrden } from "@/api/tareasOrdenService";
import { Tarea } from "@/api/tareaService";
import { useEffect, useState } from "react";
import AddTaskModal from "./AddTaskModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface OrdenTrabajoTabsProps {
  tasks: TareaOrden[]; // Recibe los productos como prop
  ordenId: number; // ID de la orden de trabajo
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  existingImages: string[]; // Aquí pasamos las imágenes existentes
  setExistingImages: React.Dispatch<React.SetStateAction<string[]>>; // Función para actualizar imágenes existentes
}
export default function OrdenTrabajoTabs({ tasks, ordenId, selectedImages, setSelectedImages, existingImages, setExistingImages }: OrdenTrabajoTabsProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskItems, setTaskItems] = useState<TareaOrden[]>(tasks || []);

  const handleAddTask = (task: Tarea) => {
    // Creamos el nuevo objeto TareaOrden según la estructura proporcionada
    const newTaskOrden: TareaOrden = {
      id_taskord: Date.now(), // Usamos un ID temporal, ya que no viene de la base de datos
      id_tarea: task.id_tarea,
      id_orden: ordenId, // Usamos el ID de la orden
      id_usuario: null, // Si el usuario existe, se asigna; si no, será null
      status: false, // Asumimos que la tarea no está completada al agregarla
      tarea: {
        id_tarea: task.id_tarea,
        titulo: task.titulo,
        descripcion: task.descripcion,
        tiempo: task.tiempo,
      },
      usuario: null,
    };

    // Agregamos la nueva tarea a la lista de tareas
    setTaskItems((prevTasks) => [...prevTasks, newTaskOrden]);

    // Cerramos el modal
    setIsTaskModalOpen(false);
  };

  useEffect(() => {
    // Cada vez que se agregue una tarea nueva, se actualiza la lista de tareas en la tabla
    setTaskItems(tasks);
  }, [tasks]);
  // Función para eliminar un producto por id_producto
  const handleRemoveTask = (id_taskord: number) => {
    setTaskItems((prevItems) => prevItems.filter((item) => item.id_taskord !== id_taskord));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (url: string) => {
    setExistingImages((prevImages: string[]) => prevImages.filter(imageUrl => imageUrl !== url));
  };
  return (
    <Tabs defaultValue="tareas" className="w-full mt-4">
      <TabsList>
        <TabsTrigger value="tareas">Tareas</TabsTrigger>
        <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
      </TabsList>

      {/* Sección de Tareas */}
      <TabsContent value="tareas">
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="hidden sm:table-cell">Descripción</TableHead>
                <TableHead className="hidden sm:table-cell">Tiempo</TableHead>
                <TableHead>Responsable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No hay tareas agregadas.
                  </TableCell>
                </TableRow>
              ) : (
                taskItems.map((task, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{task.tarea.titulo}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {task.tarea.descripcion ? (
                        <span>{task.tarea.descripcion}</span>
                      ) : (
                        <span className="text-gray-400">Sin descripción agregada</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{task.tarea.tiempo} minutos</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 cursor-pointer">
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                        <span className="underline">Asignar</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTask(task.id_taskord)}>
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-start">
            <Button type="button"
              onClick={() => setIsTaskModalOpen(true)} // Abre el modal de agregar tarea
              className="bg-customGreen hover:bg-darkGreen/50 text-black">
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar Tarea
            </Button>
          </div>
        </div>
        <AddTaskModal
          isOpen={isTaskModalOpen}
          setIsOpen={setIsTaskModalOpen}
          onAddTask={handleAddTask}
        />
      </TabsContent>

      <TabsContent value="imagenes">
        <div className="mt-4">
        {existingImages.length === 0 && selectedImages.length === 0 ? (
            <p className="text-center text-muted-foreground">No hay imágenes cargadas.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Mostrar imágenes existentes */}
              {existingImages.map((imageUrl, index) => (
                <div key={index} className="relative border rounded p-2">
                  <img src={imageUrl} alt={`Imagen ${index + 1}`} className="w-full h-auto object-cover" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 hover:bg-transparent"
                    onClick={() => handleRemoveExistingImage(imageUrl)}
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-6 w-6 text-muted-foreground" />
                  </Button>
                </div>
              ))}

              {/* Mostrar imágenes nuevas (seleccionadas pero no subidas aún) */}
              {selectedImages.map((file, index) => (
                <div key={index} className="relative border rounded p-2">
                  <img src={URL.createObjectURL(file)} alt={`Nueva imagen ${index + 1}`} className="w-full h-auto object-cover" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 hover:bg-transparent"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-6 w-6 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-start">
            <Button type="button" onClick={() => document.getElementById('fileInput')?.click()} className="bg-customGreen hover:bg-darkGreen/50 hover:text-black">
              <ImagePlus className="mr-2 h-4 w-4" /> Agregar Imágenes
            </Button>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}