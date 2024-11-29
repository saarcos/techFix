import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from '@/Components/ui/button';
import { PlusCircle, ImagePlus, Check, Clock, UserPlus, X } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import fileUploader from '../assets/icons/file-upload.svg';
import { User } from "@/api/userService";
import { DetalleOrden } from "@/api/detalleOrdenService";
import { useEffect, useState } from "react";
import { TecnicoComboboxNoForm } from "./comboBoxes/tecnico-combobox-noForm";
import { Switch } from "./ui/switch";
import AddDetalleModal from "./AddDetallesModal";
import { Product } from "@/api/productsService";
import { Service } from "@/api/servicioService";

interface OrdenTrabajoTabsProps {
  detalles: DetalleOrden[];
  onDetallesChange: (detalles: DetalleOrden[]) => void;
  ordenId: number;
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  existingImages: string[];
  setExistingImages: React.Dispatch<React.SetStateAction<string[]>>;
  tecnicos: User[],
  onTotalChange: (total: number) => void;  // Agregar esta línea
  area: string;
}

export default function OrdenTrabajoTabs({
  detalles,
  onDetallesChange,
  ordenId,
  selectedImages,
  setSelectedImages,
  existingImages,
  setExistingImages,
  tecnicos,
  onTotalChange,
  area
}: OrdenTrabajoTabsProps) {
  const [showCombobox, setShowCombobox] = useState<{ [key: number]: boolean }>({});
  const [isAddDetalleModalOpen, setIsAddDetalleModalOpen] = useState(false);

  const handleAddDetalle = (detalle: {
    producto?: Product;
    servicio?: Service;
    cantidad?: number;
    precioservicio?: number;
    precioproducto?: number;
  }) => {
    const cantidad = detalle.producto ? detalle.cantidad || 1 : 0;
    const precioservicio = Number(detalle.precioservicio) || 0;
    const precioproducto = Number(detalle.precioproducto) || 0;
    const preciototal = Number(((precioproducto * cantidad) + precioservicio).toFixed(2));

    const nuevoDetalle: DetalleOrden = {
      id_detalle: Math.random(), // Esto es solo temporal; utiliza un ID adecuado si es necesario
      id_orden: ordenId,
      id_usuario: null,
      id_servicio: detalle.servicio?.id_servicio,
      id_producto: detalle.producto?.id_producto,
      precioservicio,
      precioproducto,
      cantidad,
      preciototal,
      status: false,
      producto: detalle.producto
        ? {
          nombreProducto: detalle.producto.nombreProducto,
          preciofinal: precioproducto,
        }
        : undefined,
      servicio: detalle.servicio
        ? {
          nombre: detalle.servicio.nombre,
          preciofinal: precioservicio,
        }
        : undefined,
    };

    // Actualiza el estado con el nuevo detalle
    onDetallesChange([...detalles, nuevoDetalle]);
  };

  const handleAsignarUsuario = (id_detalle: number, id_usuario: number | null) => {
    const updatedDetalles = detalles.map((detalle) =>
      detalle.id_detalle === id_detalle ? { ...detalle, id_usuario } : detalle
    );
    onDetallesChange(updatedDetalles);
  };

  const handleStatusChange = (id_detalle: number, newStatus: boolean) => {
    const updatedDetalles = detalles.map((detalle) =>
      detalle.id_detalle === id_detalle ? { ...detalle, status: newStatus } : detalle
    );
    onDetallesChange(updatedDetalles);
  };

  const handleRemoveDetalle = (id_detalle: number) => {
    const updatedDetalles = detalles.filter((detalle) => detalle.id_detalle !== id_detalle);
    onDetallesChange(updatedDetalles);
  };

  const toggleCombobox = (id_taskord: number) => {
    setShowCombobox((prev) => ({ ...prev, [id_taskord]: !prev[id_taskord] }));
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

  useEffect(() => {
    const total = detalles.reduce((acc, detalle) => acc + Number(detalle.preciototal || 0), 0);
    onTotalChange(total);  // Llama a onTotalChange con el total calculado
  }, [detalles, onTotalChange]);

  const totalOrden = detalles.reduce((acc, detalle) => acc + Number(detalle.preciototal || 0), 0).toFixed(2);

  return (
    <Tabs defaultValue="detalles" className="w-full mt-4">
      <TabsList>
        <TabsTrigger value="detalles">Detalles</TabsTrigger>
        <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
      </TabsList>
      <TabsContent value="detalles">
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Servicio</TableHead>
                <TableHead className="text-left">Producto</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Precio Servicio</TableHead>
                <TableHead className="text-center hidden sm:table-cell">Precio Producto</TableHead>
                <TableHead className="text-left">Precio Total</TableHead>
                <TableHead className="text-left">Responsable</TableHead>
                <TableHead className="text-left">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detalles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7 } className="text-center text-muted-foreground">
                    No hay detalles agregados.
                  </TableCell>
                </TableRow>
              ) : (
                detalles.map((detalle) => (
                  <TableRow key={detalle.id_detalle}>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-center">
                        {detalle.servicio ? (
                          <span className="font-medium">{detalle.servicio.nombre}</span>
                        ) : (
                          <span className="text-gray-400">Sin servicio agregado</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {detalle.producto ? (
                          <span className="font-medium">{detalle.producto.nombreProducto} (x{detalle.cantidad})</span>
                        ) : (
                          <span className="text-gray-400">Sin producto agregado</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      <div>
                        {detalle.servicio ? (
                          <span className="font-normal">${detalle.servicio.preciofinal}</span>
                        ) : (
                          <span className="text-gray-400">Sin servicio agregado</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                      <div>
                        {detalle.producto ? (
                          <span className="font-normal">${detalle.producto.preciofinal}</span>
                        ) : (
                          <span className="text-gray-400">Sin producto agregado</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-center font-normal">${detalle.preciototal}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {!showCombobox[detalle.id_detalle] ? (
                          <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => toggleCombobox(detalle.id_detalle)}
                          >
                            <UserPlus className={`h-4 w-4 ${detalle.id_usuario ? 'text-darkGreen' : 'text-muted-foreground'}`} />
                            <span
                              className={`underline ${detalle.id_usuario ? 'text-darkGreen font-semibold' : 'text-muted-foreground'}`}
                            >
                              {detalle.id_usuario ? 'Modificar' : 'Asignar'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <TecnicoComboboxNoForm
                              tecnicos={tecnicos}
                              isTecnicoLoading={false}
                              onSelect={(id_usuario) => {
                                handleAsignarUsuario(detalle.id_detalle, id_usuario || null);
                                toggleCombobox(detalle.id_detalle);
                              }}
                              defaultSelectedId={detalle.id_usuario ?? undefined}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCombobox(detalle.id_detalle)}
                              className="text-sm font-semibold text-black w-13"
                            >
                              Cancelar
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center space-x-2">
                        {detalle.status ? (
                          <>
                            <Check className="h-4 w-4 text-darkGreen" />
                            <span className="text-darkGreen font-semibold">Completado</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground"> Pendiente</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={detalle.status}
                        onCheckedChange={(newStatus) => handleStatusChange(detalle.id_detalle, newStatus)}
                        disabled={area !=="Salida"}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDetalle(detalle.id_detalle)}
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4 pr-4">
            <span className="font-semibold text-base text-black">
              Total Orden: <span className="font-medium text-lg text-darkGreen">${totalOrden}</span>
            </span>
          </div>
          <div className="mt-4 flex justify-start">
            <Button
              type="button"
              onClick={() => setIsAddDetalleModalOpen(true)}
              className="bg-darkGreen hover:bg-darkGreen/50 text-white flex items-center space-x-2 px-4 py-2 text-sm sm:px-6 sm:text-base rounded-md w-full sm:w-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Agregar Detalle
            </Button>
          </div>
        </div>
        <AddDetalleModal
          isOpen={isAddDetalleModalOpen}
          setIsOpen={setIsAddDetalleModalOpen}
          onAddDetalle={handleAddDetalle}
        />
      </TabsContent>
      <TabsContent value="imagenes">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-darkGreen/50 rounded-lg p-4 bg-darkGreen/5 mt-4 w-full">
          {existingImages.length === 0 && selectedImages.length === 0 ? (
            <>
              <img src={fileUploader} width={96} height={77} alt='file-upload' />
              <p className="text-sm text-gray-500 mt-2">Añade imágenes del equipo para adjuntar en la orden de trabajo</p>
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
                  <ImagePlus className="mr-2 h-4 w-4" /> Agregar más imágenes
                </Button>
              </div>
            </div>
          )}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
