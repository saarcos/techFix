import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';
import axios from 'axios';

// Definimos la interface para Accesorio
export interface Accesorio {
  id_accesorio: number;
  nombre: string;
}

// Método para recuperar todos los accesorios
export const getAccesorios = async (): Promise<Accesorio[]> => {
  const response: AxiosResponse<Accesorio[]> = await axiosInstance.get<Accesorio[]>('/accesorios');
  return response.data;
};

// Método para obtener un accesorio por ID
export const getAccesorioById = async (id_accesorio: number): Promise<Accesorio> => {
    const response: AxiosResponse<Accesorio> = await axiosInstance.get<Accesorio>(`/accesorios/${id_accesorio}`);
    return response.data;
  };  

// Método para crear un nuevo accesorio
export const createAccesorio = async (accesorioData: { nombre: string }) => {
  try {
    const response = await axiosInstance.post('/accesorios', accesorioData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para actualizar un accesorio existente
export const updateAccesorio = async (accesorioData: { id_accesorio: number; nombre: string }) => {
  try {
    const response = await axiosInstance.put(`/accesorios/${accesorioData.id_accesorio}`, accesorioData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para eliminar un accesorio
export const deleteAccesorio = async (id_accesorio: number) => {
  try {
    const response = await axiosInstance.delete(`/accesorios/${id_accesorio}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
