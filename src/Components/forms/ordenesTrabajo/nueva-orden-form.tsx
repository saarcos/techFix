import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/Components/ui/form';
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/Components/ui/popover";
  import { Calendar } from "@/Components/ui/calendar"
  import { cn } from "@/lib/utils"
  import { Input } from '@/Components/ui/input';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { useForm } from 'react-hook-form';
  import * as z from 'zod';
  import { Button } from '@/Components/ui/button';
  import { Select } from '@/Components/ui/select'; 
  import { format } from "date-fns"

import { CalendarIcon } from 'lucide-react';
  
  const formSchema = z.object({
    cliente: z.string().min(1, 'Cliente es requerido'),
    equipo: z.string().min(1, 'Equipo es requerido'),
    prioridad: z.string().min(1, 'Prioridad es requerida'),
    area: z.string().min(1, 'Área es requerida'),
    trabajo: z.string().min(1, 'Trabajo es requerido'),
    estado: z.string().min(1, 'Estado es requerido'),
    estado_general: z.string(),
    diagnostico: z.string().min(1, 'Diagnóstico es requerido'),
    garantia: z.string().min(1, 'Garantía es requerida'),
    contrasena: z.string(),
    fecha_prometida: z.string().optional(),
    presupuesto: z.string().optional(),
    adelanto: z.string().optional(),
  });
  
  export default function OrdenTrabajoForm() {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        cliente: '',
        equipo: '',
        prioridad: 'Normal',
        area: 'Entrada',
        trabajo: '',
        estado: 'CHEQUEO',
        estado_general: '',
        diagnostico: 'No',
        garantia: 'No',
        contrasena: '',
        fecha_prometida: '',
        presupuesto: '',
        adelanto: '',
      },
    });
  
    const onSubmit = (values: z.infer<typeof formSchema>) => {
      console.log(values);
    };
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              name="cliente"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <Input placeholder="Buscar por nombre o CI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="equipo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Buscar por n° serie" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="prioridad"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridad</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <option value="Normal">Normal</option>
                      <option value="Alta">Alta</option>
                      <option value="Baja">Baja</option>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="area"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área</FormLabel>
                  <FormControl>
                    <Input placeholder="Área" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="trabajo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trabajo</FormLabel>
                  <FormControl>
                    <Input placeholder="Trabajo a realizar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="estado"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <option value="CHEQUEO">CHEQUEO</option>
                      <option value="REPARACION">REPARACIÓN</option>
                      <option value="TERMINADO">TERMINADO</option>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="estado_general"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado general</FormLabel>
                  <FormControl>
                    <Input placeholder="Estado general" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="diagnostico"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnóstico</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <option value="No">No</option>
                      <option value="Sí">Sí</option>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="garantia"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garantía</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <option value="No">No</option>
                      <option value="Sí">Sí</option>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="contrasena"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input placeholder="Contraseña" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="fecha_prometida"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha prometida</FormLabel>
                  <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="presupuesto"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Presupuesto</FormLabel>
                  <FormControl>
                    <Input placeholder="Importe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="adelanto"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adelanto</FormLabel>
                  <FormControl>
                    <Input placeholder="Importe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
  
          {/* Área de archivos */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Archivos</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8v8h8m-8 0L16 24m8 8l-8-8m-4 4v8h16v-8m-8-8l-8 8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Subir archivos</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">o arrastra y suelta</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
              </div>
            </div>
          </div>
  
          {/* Botones de acción */}
          <div className="flex justify-between mt-6">
            <Button variant="secondary" type="button">
              Cancelar
            </Button>
            <div>
              <Button variant="secondary" type="submit">
                Guardar y abrir
              </Button>
              <Button type="submit" className="ml-4">
                Guardar
              </Button>
            </div>
          </div>
        </form>
      </Form>
    );
  }
  