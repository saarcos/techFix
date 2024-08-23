// src/services/ServiceCategoryService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
export interface ServiceCategory {
  id_catserv: number,
  nombreCat: string
}
//Método para recuperar los serviceCategories
export const getserviceCategories = async (): Promise<ServiceCategory[]> => {
    const response: AxiosResponse<ServiceCategory[]> = await axiosInstance.get<ServiceCategory[]>('/serviceCategories');
    return response.data;
};
// Método para recuperar un serviceCategories por ID (getServiceCategoryById)
export const getServiceCategoryById = async (ServiceCategoryId: number): Promise<ServiceCategory> => {
  const response: AxiosResponse<ServiceCategory> = await axiosInstance.get<ServiceCategory>(`/serviceCategories/${ServiceCategoryId}`);
  return response.data;
};
//Método para crear nuevos ServiceCategoryos
export const createServiceCategory = async (ServiceCategoryData: { nombreCat: string }) => {
  try {
    const response = await axiosInstance.post('/serviceCategories', ServiceCategoryData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para actualizar ServiceCategory
export const updateServiceCategory = async (ServiceCategoryData: {id_catserv: number, nombreCat: string}) => {
  try {
    const response = await axiosInstance.put(`/serviceCategories/${ServiceCategoryData.id_catserv}`, ServiceCategoryData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para eliminar ServiceCategoryos
export const deleteServiceCategory = async (ServiceCategoryId: number) => {
  try {
    const response = await axiosInstance.delete(`/serviceCategories/${ServiceCategoryId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
