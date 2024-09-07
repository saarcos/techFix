// src/services/TareaService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

export interface Producto {
  id_producto: number;
  id_catprod: number;
  nombreProducto: string;
  codigoProducto: string;
  precioSinIVA: string;
  precioFinal: string;
  iva: number;
  stock: number;
}

export interface ProductoTarea {
  id_taskprod: number;
  id_producto: number;
  id_tarea: number;
  cantidad: number;
  producto: Producto;
}

export interface Servicio {
  id_servicio: number;
  id_catserv: number;
  nombre: string;
  precio: number;
}

export interface ServicioTarea {
  id_taskserv: number;
  id_servicio: number;
  id_tarea: number;
  servicio: Servicio;
}

export interface Tarea {
  id_tarea: number;
  titulo: string;
  tiempo: number;
  descripcion: string;
  productos: ProductoTarea[];
  servicios: ServicioTarea[];
}

// Método para recuperar todas las tareas incluyendo productos y servicios
export const getTareas = async (): Promise<Tarea[]> => {
  const response: AxiosResponse<Tarea[]> = await axiosInstance.get<Tarea[]>('/tareas');
  return response.data;
};

// Método para recuperar una tarea por ID incluyendo productos y servicios
export const getTareaById = async (tareaId: number): Promise<Tarea> => {
  const response: AxiosResponse<Tarea> = await axiosInstance.get<Tarea>(`/tareas/${tareaId}`);
  return response.data;
};

// Método para crear una nueva tarea
export const createTarea = async (tareaData: { titulo: string; tiempo: number; descripcion: string }) => {
  try {
    const response = await axiosInstance.post('/tareas', tareaData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para actualizar una tarea
export const updateTarea = async (tareaData: { id_tarea: number; titulo: string; tiempo: number; descripcion: string }) => {
  try {
    const response = await axiosInstance.put(`/tareas/${tareaData.id_tarea}`, tareaData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para eliminar una tarea
export const deleteTarea = async (tareaId: number) => {
  try {
    const response = await axiosInstance.delete(`/tareas/${tareaId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Métodos para manejar productos relacionados con tareas
export const addProductoToTarea = async (data: { id_tarea: number; id_producto: number; cantidad: number }) => {
  try {
    const response = await axiosInstance.post('/tareas/productos', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Métodos para manejar servicios relacionados con tareas
export const addServicioToTarea = async (data: { id_tarea: number; id_servicio: number }) => {
  try {
    const response = await axiosInstance.post('/tareas/servicios', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Métodos para actualizar productos en tareas
export const updateProductoInTarea = async (id_taskprod: number, data: { id_producto: number; cantidad: number }) => {
  try {
    const response = await axiosInstance.put(`/tareas/productos/${id_taskprod}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Métodos para actualizar servicios en tareas
export const updateServicioInTarea = async (id_taskserv: number, data: { id_servicio: number }) => {
  try {
    const response = await axiosInstance.put(`/tareas/servicios/${id_taskserv}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Métodos para eliminar productos de tareas
export const deleteProductoFromTarea = async (id_taskprod: number) => {
  try {
    const response = await axiosInstance.delete(`/tareas/productos/${id_taskprod}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Métodos para eliminar servicios de tareas
export const deleteServicioFromTarea = async (id_taskserv: number) => {
  try {
    const response = await axiosInstance.delete(`/tareas/servicios/${id_taskserv}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
