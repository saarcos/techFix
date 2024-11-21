// src/services/almacenService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

export interface Almacen {
  id_almacen: number;
  nombre: string;
}

export interface ProductoConStock {
  id_producto: number;
  nombreProducto: string;
  precioFinal: number;
  stocktotal: number;
}

// Método para recuperar todos los almacenes
export const getAlmacenes = async (): Promise<Almacen[]> => {
  const response: AxiosResponse<Almacen[]> = await axiosInstance.get<Almacen[]>('/almacenes');
  return response.data;
};

// Método para recuperar un almacén por ID
export const getAlmacenById = async (almacenId: number): Promise<Almacen> => {
  const response: AxiosResponse<Almacen> = await axiosInstance.get<Almacen>(`/almacenes/${almacenId}`);
  return response.data;
};

// Método para crear un nuevo almacén
export const createAlmacen = async (almacenData: { nombre: string }) => {
  try {
    const response = await axiosInstance.post('/almacenes', almacenData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para actualizar un almacén
export const updateAlmacen = async (almacenData: { id_almacen: number, nombre: string }) => {
  try {
    const response = await axiosInstance.put(`/almacenes/${almacenData.id_almacen}`, almacenData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para eliminar un almacén
export const deleteAlmacen = async (almacenId: number) => {
  try {
    const response = await axiosInstance.delete(`/almacenes/${almacenId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};


// Método para recuperar productos con stock disponible
export const getProductosConStock = async (): Promise<ProductoConStock[]> => {
  try {
    const response: AxiosResponse<ProductoConStock[]> = await axiosInstance.get<ProductoConStock[]>('/almacenes/productosDisponibles');
    return response.data;
  } catch (error) {
    console.error('Error al obtener productos con stock:', error);
    throw error;
  }
};
