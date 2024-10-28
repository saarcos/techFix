import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from '@/Components/ui/button';
import { PlusCircle, Clock, UserPlus, X, ImagePlus, Check } from "lucide-react";
import { TareaOrden } from "@/api/tareasOrdenService";
import { Tarea } from "@/api/tareaService";
import { useEffect, useState } from "react";
import AddTaskModal from "./AddTaskModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ProductoOrden, ServicioOrden } from "@/api/ordenTrabajoService";
import fileUploader from '../assets/icons/file-upload.svg';
import { TecnicoComboboxNoForm } from "./comboBoxes/tecnico-combobox-noForm";
import { User } from "@/api/userService";
import { Switch } from "@/Components/ui/switch";

interface OrdenTrabajoTabsProps {
  tasks: TareaOrden[];
  ordenId: number;
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  existingImages: string[];
  setExistingImages: React.Dispatch<React.SetStateAction<string[]>>;
  onProductosChange: (productos: ProductoOrden[]) => void;
  onServiciosChange: (servicios: ServicioOrden[]) => void;
  onTareasChange: (tareas: TareaOrden[]) => void;
  productosSeleccionados: ProductoOrden[];
  serviciosSeleccionados: ServicioOrden[];
  tecnicos: User[],
}

export default function OrdenTrabajoTabs({
  tasks,
  ordenId,
  selectedImages,
  setSelectedImages,
  existingImages,
  setExistingImages,
  onProductosChange,
  onServiciosChange,
  productosSeleccionados,
  serviciosSeleccionados,
  onTareasChange,
  tecnicos
}: OrdenTrabajoTabsProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskItems, setTaskItems] = useState<TareaOrden[]>(tasks || []);
  const [showCombobox, setShowCombobox] = useState<{ [key: number]: boolean }>({});

  const handleAddTask = (task: Tarea) => {
    const newTaskOrden: TareaOrden = {
      id_taskord: Date.now(),
      id_tarea: task.id_tarea,
      id_orden: ordenId,
      id_usuario: null,
      status: false,
      tarea: {
        id_tarea: task.id_tarea,
        titulo: task.titulo,
        descripcion: task.descripcion,
        tiempo: task.tiempo,
      },
      usuario: null,
    };

    if (task.productos && task.productos.length > 0) {
      const nuevosProductos: ProductoOrden[] = task.productos.map((producto) => ({
        id_prodorde: Date.now(),
        id_orden: ordenId,
        id_producto: producto.id_producto,
        cantidad: producto.cantidad,
        producto: {
          nombreProducto: producto.producto.nombreProducto,
          precioFinal: parseFloat(producto.producto.precioFinal),
          iva: producto.producto.iva,
          precioSinIVA: parseFloat(producto.producto.precioSinIVA),
        },
      }));
      onProductosChange([...productosSeleccionados, ...nuevosProductos]);
    }

    if (task.servicios && task.servicios.length > 0) {
      const nuevosServicios: ServicioOrden[] = task.servicios.map((servicio) => ({
        id_servorden: Date.now(),
        id_orden: ordenId,
        id_servicio: servicio.id_servicio,
        servicio: {
          id_servicio: servicio.id_servicio,
          nombre: servicio.servicio.nombre,
          preciofinal: servicio.servicio.preciofinal,
          preciosiniva: servicio.servicio.preciosiniva,
          iva: servicio.servicio.iva
        },
      }));
      onServiciosChange([...serviciosSeleccionados, ...nuevosServicios]);
    }

    setTaskItems((prevTasks) => [...prevTasks, newTaskOrden]);
    onTareasChange([...taskItems, newTaskOrden]);
    setIsTaskModalOpen(false);
  };

  useEffect(() => {
    setTaskItems(tasks);
  }, [tasks]);

  const handleRemoveTask = (id_taskord: number) => {
    const updatedTasks = taskItems.filter((item) => item.id_taskord !== id_taskord);
    setTaskItems(updatedTasks);
    onTareasChange(updatedTasks);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (url: string) => {
    setExistingImages((prevImages) => prevImages.filter(imageUrl => imageUrl !== url));
  };

  const handleAsignarUsuario = (id_taskord: number, id_usuario: number) => {
    const updatedTasks = taskItems.map((task) =>
      task.id_taskord === id_taskord ? { ...task, id_usuario } : task
    );
    setTaskItems(updatedTasks);
    onTareasChange(updatedTasks);
  };
  const handleStatusChange = (id_taskord: number, newStatus: boolean) => {
    const updatedTasks = taskItems.map((task) =>
      task.id_taskord === id_taskord ? { ...task, status: newStatus } : task
    );
    setTaskItems(updatedTasks);
    onTareasChange(updatedTasks);
  };
  const toggleCombobox = (id_taskord: number) => {
    setShowCombobox((prev) => ({ ...prev, [id_taskord]: !prev[id_taskord] }));
  };

  return (
    <Tabs defaultValue="tareas" className="w-full mt-4">
      <TabsList>
        <TabsTrigger value="tareas">Tareas</TabsTrigger>
        <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
      </TabsList>

      <TabsContent value="tareas">
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="hidden sm:table-cell">Descripción</TableHead>
                <TableHead className="hidden sm:table-cell">Tiempo</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Estado</TableHead>
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
                taskItems.map((task) => (
                  <TableRow key={task.id_taskord}>
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
                        {task.status ? (
                          <>
                            <Check className="h-4 w-4 text-darkGreen" /> {/* Icono de checkmark en verde */}
                            <span className="text-darkGreen font-semibold">Completada</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-muted-foreground" /> {/* Icono de reloj en gris */}
                            <span className="text-muted-foreground">{task.tarea.tiempo} minutos</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                    <div className="flex items-center space-x-2">
                        {!showCombobox[task.id_taskord] ? (
                          <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => toggleCombobox(task.id_taskord)}
                          >
                            <UserPlus className={`h-4 w-4 ${task.id_usuario ? 'text-darkGreen' : 'text-muted-foreground'}`}/>
                            <span
                              className={`underline ${task.id_usuario ? 'text-darkGreen font-semibold' : 'text-muted-foreground'
                                }`}
                            >
                              {task.id_usuario ? 'Modificar' : 'Asignar'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <TecnicoComboboxNoForm
                              tecnicos={tecnicos}
                              isTecnicoLoading={false}
                              onSelect={(id_usuario) => {
                                handleAsignarUsuario(task.id_taskord, id_usuario);
                                toggleCombobox(task.id_taskord); // Ocultar el combobox después de seleccionar
                              }}
                              defaultSelectedId={task.id_usuario ?? undefined}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCombobox(task.id_taskord)}
                              className="text-sm font-semibold text-black w-13"
                            >
                              Cancelar
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={task.status}
                        onCheckedChange={(newStatus) => handleStatusChange(task.id_taskord, newStatus)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTask(task.id_taskord)}
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-start">
            <Button
              type="button"
              onClick={() => setIsTaskModalOpen(true)}
              className="bg-darkGreen hover:bg-darkGreen/50 text-white flex items-center space-x-2 px-4 py-2 text-sm sm:px-6 sm:text-base rounded-md w-full sm:w-auto"
            >
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
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-darkGreen/50 rounded-lg p-4 bg-darkGreen/5 mt-4 w-full">
          {existingImages.length === 0 && selectedImages.length === 0 ? (
            <>
              <img src={fileUploader} width={96} height={77} alt='file-upload' />
              <p className="text-sm text-gray-500 mt-2">Añade imagenes del equipo para adjuntar en la orden de trabajo</p>
              <Button
                type="button"
                variant="secondary"
                className="mt-2 bg-darkGreen/60 hover:bg-darkGreenHover/80"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                Navegar
              </Button>
            </>
          ) : (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div className="mt-4 flex justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className="mt-4 bg-darkGreen/30 hover:bg-darkGreenHover/30"
                >
                  <ImagePlus className="mr-2 h-4 w-4" /> Agregar más imagenes
                </Button>
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-start">
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
