// src/services/ProductCategoryService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
export interface ProductCategory {
  id_catprod: number,
  nombreCat: string
}
//Método para recuperar los ProductCategoryos
export const getProductCategories = async (): Promise<ProductCategory[]> => {
    const response: AxiosResponse<ProductCategory[]> = await axiosInstance.get<ProductCategory[]>('/productCategories');
    return response.data;
};
// Método para recuperar un ProductCategoryo por ID (getProductCategoryById)
export const getProductCategoryById = async (ProductCategoryId: number): Promise<ProductCategory> => {
  const response: AxiosResponse<ProductCategory> = await axiosInstance.get<ProductCategory>(`/productCategories/${ProductCategoryId}`);
  return response.data;
};
//Método para crear nuevos ProductCategoryos
export const createProductCategory = async (ProductCategoryoData: { nombreCat: string }) => {
  try {
    const response = await axiosInstance.post('/productCategories', ProductCategoryoData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para actualizar ProductCategory
export const updateProductCategory = async (ProductCategoryoData: {id_catprod: number, nombreCat: string}) => {
  try {
    const response = await axiosInstance.put(`/productCategories/${ProductCategoryoData.id_catprod}`, ProductCategoryoData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para eliminar ProductCategoryos
export const deleteProductCategory = async (ProductCategoryId: number) => {
  try {
    const response = await axiosInstance.delete(`/productCategories/${ProductCategoryId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
