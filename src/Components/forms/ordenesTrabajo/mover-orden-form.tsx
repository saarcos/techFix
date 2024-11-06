import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/Components/ui/form';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { TecnicoCombobox } from '@/Components/comboBoxes/tecnico-combobox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { moveOrdenTrabajo, OrdenTrabajo } from '@/api/ordenTrabajoService';
import { toast } from 'sonner';
import { getUsers, User } from '@/api/userService';
import { Dispatch, SetStateAction, useEffect } from 'react';

// Define el esquema de validación para el formulario
const moveFormSchema = z.object({
    area: z.string().min(1, 'Área es requerida'),
    estado: z.string().min(1, 'Estado es requerido'),
    id_usuario: z.number().nullable().optional(), // Acepta null inicialmente
}).refine((data) => {
    // Si el área es "Reparación" o "Salida", entonces `id_usuario` no debe ser null
    if (data.area === 'Reparación' || data.area === 'Salida') {
        return data.id_usuario !== null;
    }
    return true; // Para "Entrada" `id_usuario` puede ser null
}, {
    message: 'Técnico es requerido para el área de Reparación o Salida',
    path: ['id_usuario'], // Especifica que el error es en `id_usuario`
});
interface MoveOrdenTrabajoFormProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    order: OrdenTrabajo | null;
}

export default function MoveOrdenTrabajoForm({ order, setIsOpen }: MoveOrdenTrabajoFormProps) {
    const form = useForm<z.infer<typeof moveFormSchema>>({
        resolver: zodResolver(moveFormSchema),
        defaultValues: {
            area: order?.area || 'Entrada',
            estado: order?.estado || 'CHEQUEO',
            id_usuario: order?.id_usuario ?? null,
        },
    });
    const queryClient = useQueryClient();
    const { data: tecnicos = [], isLoading: isTecnicoLoading } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: getUsers,
    });
    useEffect(() => {
        if (order) {
            // Actualiza los valores del formulario cuando la orden cambia
            form.reset({
                area: order.area,
                estado: order.estado,
                id_usuario: order.id_usuario ?? null,
            });
        }
    }, [order, form]);

    // Define la mutación para mover la orden de trabajo
    const moveMutation = useMutation({
        mutationFn: (data: z.infer<typeof moveFormSchema>) =>
            moveOrdenTrabajo(order?.id_orden || 0, data.area, data.estado, data.id_usuario ?? null), 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ordenesTrabajo'] });
            toast.success('Orden movida exitosamente');
            setIsOpen(false);
        },
        onError: () => {
            toast.error('Error al mover la orden');
        },
    });

    // Maneja el envío del formulario
    const onSubmit = (values: z.infer<typeof moveFormSchema>) => {
        const sanitizedValues = {
            ...values,
            id_usuario: values.id_usuario ?? null, // Asigna null si id_usuario es undefined
        };
        moveMutation.mutate(sanitizedValues);
    };
    const selectedArea = form.watch('area'); // Observar el área seleccionada

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    name="area"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Área</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un área" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Entrada">Entrada</SelectItem>
                                    <SelectItem value="Reparación">Reparación</SelectItem>
                                    <SelectItem value="Salida">Salida</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Campo condicional de técnico */}
                {(selectedArea === 'Reparación' || selectedArea === 'Salida') && (
                    <FormField
                        name="id_usuario"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Técnico</FormLabel>
                                <FormControl>
                                    <TecnicoCombobox field={field} tecnicos={tecnicos} isTecnicoLoading={isTecnicoLoading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    name="estado"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un estado" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="CHEQUEO">CHEQUEO</SelectItem>
                                    <SelectItem value="REPARACION">REPARACIÓN</SelectItem>
                                    <SelectItem value="TERMINADO">TERMINADO</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end mt-4">
                    <Button type="submit" className="bg-customGreen hover:bg-customGreenHover">
                        Mover Orden
                    </Button>
                </div>
            </form>
        </Form>
    );
}
