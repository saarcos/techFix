// src/services/brandModelService.ts
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
export interface BrandModel {
    marcaNombre: string;
    modeloNombre: string;
}
//Método para crear nuevas marcas
export const createBrandModel = async (brandModelData: { marcaNombre: string, modeloNombre:string}) => {
    try {
      const response = await axiosInstance.post('/brand-model', brandModelData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      } else {
        throw new Error('Error inesperado');
      }
    }
};