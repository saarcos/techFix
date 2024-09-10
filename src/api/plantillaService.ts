import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

// Definir interfaces para Producto, Servicio y las relaciones con Tareas
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

export interface Servicio {
  id_servicio: number;
  nombre: string;
  precio: number;
}

export interface ProductoTarea {
  id_taskprod: number;
  id_producto: number;
  id_tarea: number;
  cantidad: number;
  producto: Producto;
}

export interface ServicioTarea {
  id_taskserv: number;
  id_servicio: number;
  id_tarea: number;
  servicio: Servicio;
}

export interface TareaAnidada {
  id_taskgroup: number;
  id_tarea: number;
  id_grupo: number;
  tarea: Tarea; // Aquí referenciamos la tarea anidada
}

export interface Tarea {
  id_tarea: number;
  titulo: string;
  descripcion: string;
  tiempo: number;
  productos?: ProductoTarea[];
  servicios?: ServicioTarea[];
}

export interface Plantilla {
  id_grupo: number;
  descripcion: string;
  tareas: TareaAnidada[]; // Aquí ajustamos la estructura de las tareas anidadas
}

// Método para obtener todas las plantillas
export const getPlantillas = async (): Promise<Plantilla[]> => {
  try {
    const response: AxiosResponse<Plantilla[]> = await axiosInstance.get<Plantilla[]>('/plantillas');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para obtener una plantilla por su ID
export const getPlantillaById = async (id_grupo: number): Promise<Plantilla> => {
  try {
    const response: AxiosResponse<Plantilla> = await axiosInstance.get<Plantilla>(`/plantillas/${id_grupo}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};


// Método para crear una nueva plantilla
export const createPlantilla = async (plantillaData: { descripcion: string; tareas: number[] }) => {
  try {
    const response = await axiosInstance.post('/plantillas', plantillaData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para actualizar una plantilla
export const updatePlantilla = async (id_grupo: number, plantillaData: { descripcion: string; tareas: number[] }) => {
  try {
    const response = await axiosInstance.put(`/plantillas/${id_grupo}`, plantillaData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para eliminar una plantilla
export const deletePlantilla = async (id_grupo: number) => {
  try {
    const response = await axiosInstance.delete(`/plantillas/${id_grupo}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para asignar una plantilla a una orden de trabajo
export const asignarPlantillaAOrden = async (asignarData: { id_grupo: number; id_orden: number; id_usuario: number }) => {
  try {
    const response = await axiosInstance.post('/plantillas/asignar', asignarData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
