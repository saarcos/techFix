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
export const createOrdenTrabajo = async (ordenTrabajoData: Omit<OrdenTrabajo, 'id_orden' | 'numero_orden' | 'imagenes'> & { imagenes?: string[] }): Promise<OrdenTrabajo> => {
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
export const updateOrdenTrabajo = async (ordenTrabajoData: Omit<OrdenTrabajo, 'numero_orden'> & { imagenes?: string[] }): Promise<OrdenTrabajo> => {
  try {
    const response = await axiosInstance.put(`/ordenes/${ordenTrabajoData.id_orden}`, ordenTrabajoData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
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
