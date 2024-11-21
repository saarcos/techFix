// src/services/ProductService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
export interface Product {
  id_producto: number;
  id_catprod: number;
  nombreProducto: string;
  codigoProducto: string;
  precioSinIVA: number;
  precioFinal: number;
  iva: number;
  categoriaProducto: {
    nombreCat: string;
  };
}
//Método para recuperar los productos
export const getProducts = async (): Promise<Product[]> => {
    const response: AxiosResponse<Product[]> = await axiosInstance.get<Product[]>('/productos');
    return response.data;
};
// Método para recuperar un producto por ID (getProductById)
export const getProductById = async (ProductId: number): Promise<Product> => {
  const response: AxiosResponse<Product> = await axiosInstance.get<Product>(`/productos/${ProductId}`);
  return response.data;
};
//Método para crear nuevos productos
export const createProduct = async (productoData: { id_catprod: number; nombreProducto: string; codigoProducto?: string; precioSinIVA: number; precioFinal: number; iva: number;  }) => {
  try {
    const response = await axiosInstance.post('/productos', productoData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para actualizar productos
export const updateProduct = async (productoData: {id_producto: number,id_catprod: number; nombreProducto: string; codigoProducto?: string; precioSinIVA: number; precioFinal: number; iva: number; }) => {
  try {
    const response = await axiosInstance.put(`/productos/${productoData.id_producto}`, productoData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para eliminar productos
export const deleteProduct = async (ProductId: number) => {
  try {
    const response = await axiosInstance.delete(`/productos/${ProductId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
