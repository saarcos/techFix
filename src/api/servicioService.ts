// src/services/ServiceService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
export interface Service {
  id_servicio: number;
  id_catserv: number;
  nombre: string;
  precio: number;
  categoriaServicio: {
    nombreCat: string;
  }
}
//Método para recuperar los servicios
export const getServices = async (): Promise<Service[]> => {
    const response: AxiosResponse<Service[]> = await axiosInstance.get<Service[]>('/servicios');
    return response.data;
};
// Método para recuperar un servicios por ID (getServiceById)
export const getServiceById = async (ServiceId: number): Promise<Service> => {
  const response: AxiosResponse<Service> = await axiosInstance.get<Service>(`/servicios/${ServiceId}`);
  return response.data;
};
//Método para crear nuevos servicios
export const createService = async (serviceData: { id_catserv: number; nombre: string; precio: number}) => {
  try {
    const response = await axiosInstance.post('/servicios', serviceData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para actualizar Serviceos
export const updateService = async (serviceData: { id_servicio: number; id_catserv: number; nombre: string; precio: number}) => {
  try {
    const response = await axiosInstance.put(`/servicios/${serviceData.id_servicio}`, serviceData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para eliminar Serviceos
export const deleteService = async (ServiceId: number) => {
  try {
    const response = await axiosInstance.delete(`/servicios/${ServiceId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
