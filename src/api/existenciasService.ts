// src/services/existenciasService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

export interface Existencia {
  id_existencias: number;
  id_almacen: number;
  id_producto: number;
  cantidad: number;
  almacen?: { nombre: string };
  producto?: { nombreProducto: string; codigoProducto: string };
}

// Obtener todas las existencias
export const getExistencias = async (): Promise<Existencia[]> => {
  const response: AxiosResponse<Existencia[]> = await axiosInstance.get('/existencias');
  return response.data;
};

// Obtener existencia por ID
export const getExistenciaById = async (id_existencias: number): Promise<Existencia> => {
  const response: AxiosResponse<Existencia> = await axiosInstance.get(`/existencias/${id_existencias}`);
  return response.data;
};

// Obtener existencias por ID de almacén
export const getExistenciasByAlmacenId = async (id_almacen: number): Promise<Existencia[]> => {
  const response: AxiosResponse<Existencia[]> = await axiosInstance.get(`/existencias-almacen/${id_almacen}`);
  return response.data;
};

// Crear una nueva existencia
export const createExistencia = async (existenciaData: { id_almacen: number; id_producto: number; cantidad: number }) => {
  try {
    const response = await axiosInstance.post('/existencias', existenciaData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Actualizar una existencia
export const updateExistencia = async (existenciaData: { id_existencias: number; id_almacen: number; id_producto: number; cantidad: number }) => {
  try {
    const response = await axiosInstance.put(`/existencias/${existenciaData.id_existencias}`, existenciaData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Eliminar una existencia
export const deleteExistencia = async (id_existencias: number) => {
  try {
    const response = await axiosInstance.delete(`/existencias/${id_existencias}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
