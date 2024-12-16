// src/services/modeloService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
export interface Model {
  id_modelo: number;
  id_marca: number;
  nombre: string;
  marca:{
    nombre: string;
  }
}
//Método para recuperar las modelos
export const getModels = async (): Promise<Model[]> => {
    const response: AxiosResponse<Model[]> = await axiosInstance.get<Model[]>('/modelos');
    return response.data;
};
// Método para recuperar un modelo por ID (getModelById)
export const getModelById = async (ModelId: number): Promise<Model> => {
  const response: AxiosResponse<Model> = await axiosInstance.get<Model>(`/modelos/${ModelId}`);
  return response.data;
};
//Método para crear nuevos modelos
export const createModel = async (ModelData: { id_marca: number; nombre: string}) => {
  try {
    const response = await axiosInstance.post('/modelos', ModelData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para actualizar modelos
export const updateModel = async (ModelData: {id_modelo:number; id_marca: number; nombre: string}) => {
  try {
    const response = await axiosInstance.put(`/modelos/${ModelData.id_modelo}`, ModelData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para eliminar modelos
export const deleteModel = async (ModelId: number) => {
  try {
    const response = await axiosInstance.delete(`/modelos/${ModelId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
