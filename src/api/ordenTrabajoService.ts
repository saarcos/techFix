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
    }
    servicio?: {
        nombre: string;
        preciofinal: number;
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
  estado: string;
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
}
export interface OrdenTrabajoCreate {
  id_equipo: number;
  id_usuario: number | null;
  cliente_id: number; // Cambiado de id_cliente a cliente_id
  area: string;
  prioridad: string;
  descripcion: string;
  estado: string;
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
  estado: string;
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
  weekly: {
    earnings: number;
    change: number;
  };
  monthly: {
    earnings: number;
    change: number;
  };
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
// Método para mover una orden de trabajo
export const moveOrdenTrabajo = async (id_orden: number, area: string, estado: string, id_usuario: number | null): Promise<void> => {
  try {
    const response = await axiosInstance.put(`/ordenes/mover/${id_orden}`, {
      area,
      estado,
      id_usuario,
    });
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