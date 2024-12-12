// src/services/OrdenTrabajoService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

export interface DetalleOrden {
    id_detalle: number;
    id_orden: number;
    id_usuario?: number | null; // Permitimos null para cuando no haya usuario asignado
    id_servicio?: number;
    id_producto?: number;
    precioservicio?: number;
    precioproducto?: number;
    cantidad: number;
    preciototal: number;
    status: boolean;
    producto?: {
        nombreProducto: string;
        preciofinal: number;
        preciosiniva: number;
        iva: number;
    }
    servicio?: {
        nombre: string;
        preciofinal: number;
        preciosiniva: number;
        iva: number;
    }
}
export interface ImagenOrden {
  id_imagen: number;
  url_imagen: string;
}
export interface OrdenTrabajo {
  id_orden: number;
  id_equipo: number;
  id_usuario: number | null;
  cliente_id: number; // Cambiado de id_cliente a cliente_id
  numero_orden: string;
  area: string;
  prioridad: string;
  descripcion: string;
  created_at: Date;
  fecha_prometida: Date | null;
  presupuesto: number | null;
  adelanto: number | null;
  total: number | null;
  confirmacion: boolean;
  passwordequipo: string | null;
  imagenes: { url_imagen: string }[];
  equipo: {
    nserie: string;
    modelo: {
      nombre: string;
      marca: {
        nombre: string;
      }
    };
    cliente: {  // Ahora obtenemos el cliente a través de equipo
      nombre: string;
      apellido: string;
      cedula: string;
      correo: string;
      celular: string;
    };
  };
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
  };
  detalles: DetalleOrden[]; // Agregar aquí los detalles de la orden
  accesorios:{
    Accesorio:{
      nombre: string;
    }
  }
}
export interface OrdenTrabajoCreate {
  id_equipo: number;
  id_usuario: number | null;
  cliente_id: number; // Cambiado de id_cliente a cliente_id
  area: string;
  prioridad: string;
  descripcion: string;
  fecha_prometida: Date | null;
  presupuesto: number | null;
  adelanto: number | null;
  total: number | null;
  confirmacion: boolean;
  passwordequipo: string | null;
  imagenes?: string[];
}
export interface OrdenTrabajoUpdate {
  id_orden: number;
  id_equipo: number;
  id_usuario: number | null;
  cliente_id: number; // Cambiado de id_cliente a cliente_id
  area: string;
  prioridad: string;
  descripcion: string;
  fecha_prometida: Date | null;
  presupuesto: number | null;
  adelanto: number | null;
  total: number | null;
  confirmacion: boolean;
  passwordequipo: string | null;
  imagenes?: string[]; 
}

// Método para recuperar las métricas de ganancias semanales y mensuales
export interface OrdenesMetrics {
  monthly: {
    earnings: number;
    change: number;
  };
}
export interface GlobalOrdenesMetrics {
  totalRecaudado: number;
  totalOrdenes: number;
}
export interface RecentClient {
  id_cliente: number; // ID del cliente
  nombre: string; // Nombre del cliente
  apellido: string; // Apellido del cliente
  correo: string; // Correo del cliente
  total_spent: number; // Total gastado por el cliente
  last_order_date: string; // Fecha de la última orden
}
export interface RecentOrdersResponse {
  recentClients: RecentClient[]; // Lista de clientes recientes
  totalOrders: number; // Total de órdenes registradas
}
export interface MonthlyEarnings {
  month_label: string; // Nombre del mes
  total_earnings: number; // Ganancias totales del mes
}
// Método para recuperar todas las órdenes de trabajo
export const getOrdenesTrabajo = async (): Promise<OrdenTrabajo[]> => {
  const response: AxiosResponse<OrdenTrabajo[]> = await axiosInstance.get<OrdenTrabajo[]>('/ordenes');
  return response.data;
};

// Método para recuperar una orden de trabajo por ID (getOrdenTrabajoById)
export const getOrdenTrabajoById = async (ordenTrabajoId: number): Promise<OrdenTrabajo> => {
  const response: AxiosResponse<OrdenTrabajo> = await axiosInstance.get<OrdenTrabajo>(`/ordenes/${ordenTrabajoId}`);
  return response.data;
};
// Método para recuperar una orden de trabajo por ID de equipo (getOrdenTrabajoByEquipoId)
export const getOrdenTrabajoByEquipoId = async (id_equipo: number): Promise<OrdenTrabajo[]> => {
  const response: AxiosResponse<OrdenTrabajo[]> = await axiosInstance.get<OrdenTrabajo[]>(`/ordenes-equipo/${id_equipo}`);
  return response.data;
};
// Método para recuperar una orden de trabajo por ID de equipo (getOrdenTrabajoByEquipoId)
export const getOrdenTrabajoByClienteId = async (cliente_id: number): Promise<OrdenTrabajo[]> => {
  const response: AxiosResponse<OrdenTrabajo[]> = await axiosInstance.get<OrdenTrabajo[]>(`/ordenes-cliente/${cliente_id}`);
  return response.data;
};

// Método para crear una nueva orden de trabajo
export const createOrdenTrabajo = async (ordenTrabajoData: OrdenTrabajoCreate): Promise<OrdenTrabajo> => {
  try {
    const response = await axiosInstance.post('/ordenes', ordenTrabajoData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
// Método para actualizar una orden de trabajo
export const updateOrdenTrabajo = async (ordenTrabajoData: OrdenTrabajoUpdate): Promise<OrdenTrabajo> => {
  try {
    const response: AxiosResponse<OrdenTrabajo> = await axiosInstance.put(`/ordenes/${ordenTrabajoData.id_orden}`, ordenTrabajoData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data; // Manejo de errores de Axios
    } else {
      throw new Error('Error inesperado'); // Otro tipo de errores
    }
  }
};

// Método para eliminar una orden de trabajo
export const deleteOrdenTrabajo = async (ordenTrabajoId: number): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/ordenes/${ordenTrabajoId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
export const getOrdenesMetrics = async (): Promise<OrdenesMetrics> => {
  try {
    const response: AxiosResponse<OrdenesMetrics> = await axiosInstance.get<OrdenesMetrics>('/ordenes/metrics');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data; // Manejo de errores específicos de Axios
    } else {
      throw new Error('Error inesperado'); // Otro tipo de errores
    }
  }
};
export const getGlobalMetricsOrdenes = async (): Promise<GlobalOrdenesMetrics> => {
  try {
    const response: AxiosResponse<GlobalOrdenesMetrics> = await axiosInstance.get<GlobalOrdenesMetrics>('/ordenes/globalMetrics');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data; // Manejo de errores específicos de Axios
    } else {
      throw new Error('Error inesperado'); // Otro tipo de errores
    }
  }
};
export const getRecentOrders = async (): Promise<RecentOrdersResponse> => {
  try {
    const response: AxiosResponse<RecentOrdersResponse> = await axiosInstance.get<RecentOrdersResponse>('/ordenes/recentOrders');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data; // Manejo de errores específicos de Axios
    } else {
      throw new Error('Error inesperado'); // Otro tipo de errores
    }
  }
};
export const getMonthlyEarnings = async (): Promise<MonthlyEarnings[]> => {
  try {
    const response: AxiosResponse<{ monthlyEarnings: MonthlyEarnings[] }> = 
      await axiosInstance.get<{ monthlyEarnings: MonthlyEarnings[] }>('/ordenes/monthlyEarnings');
    return response.data.monthlyEarnings;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data; // Manejo de errores específicos de Axios
    } else {
      throw new Error('Error inesperado'); // Otro tipo de errores
    }
  }
};
