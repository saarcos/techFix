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
  nombreProducto: string;
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
export const createTarea = async (tareaData: {
  titulo: string;
  tiempo: number;
  descripcion: string;
}) => {
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
export const updateTarea = async (tareaData: {
  id_tarea: number;
  titulo: string;
  tiempo: number;
  descripcion: string;
  productos: { id_producto: number; cantidad: number }[];
  servicios: { id_servicio: number }[];
}) => {
  try {
    // Mandamos también productos y servicios en el cuerpo de la solicitud
    const response = await axiosInstance.put(`/tareas/${tareaData.id_tarea}`, {
      titulo: tareaData.titulo,
      tiempo: tareaData.tiempo,
      descripcion: tareaData.descripcion,
      productos: tareaData.productos, // Array de productos con id_producto y cantidad
      servicios: tareaData.servicios, // Array de servicios con id_servicio
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

// Método para añadir productos a una tarea (usando el cuerpo de la petición)
export const addProductosToTarea = async (data: { id_tarea: number; productos: { id_producto: number; cantidad: number }[] }) => {
  try {
    const response = await axiosInstance.post('/tareas/productos', data); // Aquí enviamos el id_tarea en el cuerpo
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para añadir servicios a una tarea (usando el cuerpo de la petición)
export const addServiciosToTarea = async (data: { id_tarea: number; servicios: { id_servicio: number }[] }) => {
  try {
    const response = await axiosInstance.post('/tareas/servicios', data); // Aquí enviamos el id_tarea en el cuerpo
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
