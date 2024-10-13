import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import axios from 'axios';

export interface AccesorioDeOrdenCreate {
    id_accesorio: number;
    id_orden: number;
}

// Definimos la interfaz para el accesorio en una orden
export interface Accesorio {
    id_accesorio: number;
    nombre: string;
  }
  
  export interface AccesorioDeOrden {
    id_accesorioord: number;
    id_orden: number;
    id_accesorio: number;
    Accesorio: Accesorio; // Aquí incluimos la relación con el accesorio
  }

// Método para añadir accesorios a una orden de trabajo
export const addAccesoriosToOrden = async (accesorios: AccesorioDeOrdenCreate[]): Promise<AccesorioDeOrden[]> => {
    try {
      const response: AxiosResponse<AccesorioDeOrden[]> = await axiosInstance.post('/accesorios-orden', {
        accesorios,
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

// Método para actualizar los accesorios de una orden de trabajo
export const updateAccesoriosOrden = async (id_orden: number, accesorios: AccesorioDeOrdenCreate[]): Promise<string> => {
  try {
    const response: AxiosResponse<{ message: string }> = await axiosInstance.put(`/accesorios-orden/${id_orden}`, {
      accesorios,
    });
    return response.data.message;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para obtener los accesorios de una orden de trabajo
export const getAccesoriosByOrden = async (id_orden: number): Promise<AccesorioDeOrden[]> => {
  try {
    const response: AxiosResponse<AccesorioDeOrden[]> = await axiosInstance.get(`/accesorios-orden/${id_orden}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para eliminar un accesorio de una orden de trabajo
export const deleteAccesorioFromOrden = async (id_accesorioord: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/ordenes/accesorios/${id_accesorioord}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
