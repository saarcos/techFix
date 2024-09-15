// src/services/OrdenTrabajoService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

export interface ImagenOrden {
  id_imagen: number;
  url_imagen: string;
}

export interface OrdenTrabajo {
  id_orden: number;
  id_equipo: number;
  id_usuario: number | null;
  id_cliente: number;
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
    marca: {
      nombre: string;
    };
    modelo: {
      nombre: string;
    };
  };
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
  };
  cliente: {
    nombre: string;
    apellido: string;
    cedula: string;
    correo: string;
    celular: string;
  };
}
export interface OrdenTrabajoCreate {
  id_equipo: number;
  id_usuario: number | null;
  id_cliente: number;
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
  id_cliente: number;
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
