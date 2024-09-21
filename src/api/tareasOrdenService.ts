// src/services/TareaOrdenService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

export interface Tarea {
    id_tarea: number;
    titulo: string;
    descripcion: string;
    tiempo: number;
  }
  
  export interface Usuario {
    id_usuario: number;
    nombre: string;
    apellido: string;
  }
  
  export interface TareaOrden {
    id_taskord: number;
    id_tarea: number;
    id_orden: number;
    id_usuario: number | null;
    status: boolean;
    tarea: Tarea; // Relación con la tarea
    usuario: Usuario | null; // Relación opcional con el usuario
}

// Método para obtener todas las tareas de una orden (getTareasByOrderId)
export const getTareasByOrderId = async (orderId: number): Promise<TareaOrden[]> => {
  const response: AxiosResponse<TareaOrden[]> = await axiosInstance.get<TareaOrden[]>(`/tareasorden/${orderId}`);
  return response.data;
};

// Método para agregar múltiples tareas a una orden
export const addTareasToOrder = async (
  tareas: { id_tarea: number; id_orden: number; id_usuario?: number; status?: boolean }[]
): Promise<{ message: string }> => {
  try {
    const response: AxiosResponse<{ message: string }> = await axiosInstance.post<{ message: string }>('/tareasorden', tareas);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para actualizar una tarea en una orden
export const updateTareaInOrder = async (
  id_taskord: number,
  id_tarea: number,
  id_usuario?: number,
  status?: boolean
): Promise<TareaOrden> => {
  try {
    const response: AxiosResponse<TareaOrden> = await axiosInstance.put<TareaOrden>(`/tareasorden/${id_taskord}`, {
      id_tarea,
      id_usuario,
      status,
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

// Método para eliminar una tarea de una orden
export const deleteTareaFromOrder = async (id_taskord: number): Promise<void> => {
  try {
    const response: AxiosResponse<void> = await axiosInstance.delete<void>(`/tareasorden/${id_taskord}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
