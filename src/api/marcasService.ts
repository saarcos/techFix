// src/services/marcasService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
export interface Brand {
  nombre: string;
  id_marca: number;
}
//Método para recuperar las marcas
export const getBrands = async (): Promise<Brand[]> => {
    const response: AxiosResponse<Brand[]> = await axiosInstance.get<Brand[]>('/marcas');
    return response.data;
};
// Método para recuperar una marca por ID (getBrandById)
export const getBrandById = async (BrandId: number): Promise<Brand> => {
  const response: AxiosResponse<Brand> = await axiosInstance.get<Brand>(`/marcas/${BrandId}`);
  return response.data;
};
//Método para crear nuevas marcas
export const createBrande = async (BrandData: { nombre: string}) => {
  try {
    const response = await axiosInstance.post('/marcas', BrandData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para actualizar marcas
export const updateBrande = async (BrandData: { id_brand:number, nombre: string;}) => {
  try {
    const response = await axiosInstance.put(`/marcas/${BrandData.id_brand}`, BrandData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para eliminar marcas
export const deleteBrand = async (BrandId: number) => {
  try {
    const response = await axiosInstance.delete(`/marcas/${BrandId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
