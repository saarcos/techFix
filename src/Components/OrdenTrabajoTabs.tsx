import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { useState } from "react";
import { Button } from '@/Components/ui/button';
import { PlusCircle, ImagePlus, Clock, UserPlus, X } from "lucide-react";
import { TareaOrden } from "@/api/tareasOrdenService";

interface OrdenTrabajoTabsProps {
  tasks: TareaOrden[]; // Recibe los productos como prop
}
export default function OrdenTrabajoTabs({ tasks }: OrdenTrabajoTabsProps) {
  // Datos de prueba para imágenes
  const [images, setImages] = useState([
    { url: 'https://via.placeholder.com/150', id: 1 },
    { url: 'https://via.placeholder.com/150', id: 2 },
    { url: 'https://via.placeholder.com/150', id: 3 }
  ]);

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
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No hay tareas agregadas.
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task, index) => (
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
                      <Button type="button" variant="ghost" size="sm">
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-start">
            <Button type="button" onClick={() => {/* lógica para agregar tarea */ }} className="bg-darkGreen hover:bg-darkGreen/50 hover:text-black">
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar Tarea
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="imagenes">
        <div className="mt-4">
          {images.length === 0 ? (
            <p className="text-center text-muted-foreground">No hay imágenes cargadas.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative border rounded p-2">
                  <img src={image.url} alt={`Imagen ${index + 1}`} className="w-full h-auto object-cover" />
                  {/* Botón de eliminar en posición absoluta */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 hover:bg-transparent"
                    onClick={() => {/* lógica para eliminar imagen */ }}>
                    <X className="h-6 w-6 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex justify-start">
            <Button onClick={() => {/* lógica para agregar imágenes */ }} className="bg-darkGreen hover:bg-darkGreen/50 hover:text-black">
              <ImagePlus className="mr-2 h-4 w-4" /> Agregar Imágenes
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
