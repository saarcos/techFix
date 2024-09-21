// src/services/ProductoOrdenService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

// Definir la interfaz para un producto en una orden
export interface ProductoOrden {
  id_prodorde: number;
  id_producto: number;
  id_orden: number;
  cantidad: number;
}

// Método para obtener todos los productos de una orden (getProductsByOrderId)
export const getProductsByOrderId = async (orderId: number): Promise<ProductoOrden[]> => {
  const response: AxiosResponse<ProductoOrden[]> = await axiosInstance.get<ProductoOrden[]>(`/ordenes/${orderId}/productos`);
  return response.data;
};

// Método para agregar varios productos a una orden
export const addProductsToOrder = async (orderId: number, productos: { id_producto: number; cantidad: number }[]): Promise<ProductoOrden[]> => {
  try {
    const response: AxiosResponse<ProductoOrden[]> = await axiosInstance.post<ProductoOrden[]>(`/ordenes/${orderId}/productos`, {
      id_orden: orderId,
      productos,
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

// Método para actualizar un producto en una orden
export const updateProductInOrder = async (id_prodorde: number, id_producto: number, cantidad: number): Promise<ProductoOrden> => {
  try {
    const response: AxiosResponse<ProductoOrden> = await axiosInstance.put<ProductoOrden>(`/productosorden/${id_prodorde}`, {
      id_producto,
      cantidad,
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

// Método para eliminar un producto de una orden
export const deleteProductFromOrder = async (id_prodorde: number): Promise<void> => {
  try {
    const response: AxiosResponse<void> = await axiosInstance.delete<void>(`/productosorden/${id_prodorde}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
