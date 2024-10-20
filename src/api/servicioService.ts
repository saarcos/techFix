// src/services/ServiceService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

export interface Service {
  id_servicio: number;
  id_catserv: number;
  nombre: string;
  preciosiniva: number;  // Añadido el campo preciosiniva
  preciofinal: number;    // Añadido el campo preciofinal
  iva: number;            // Añadido el campo iva
  categoriaServicio: {
    nombreCat: string;
  };
}

// Método para recuperar los servicios
export const getServices = async (): Promise<Service[]> => {
  const response: AxiosResponse<Service[]> = await axiosInstance.get<Service[]>('/servicios');
  return response.data;
};

// Método para recuperar un servicio por ID (getServiceById)
export const getServiceById = async (serviceId: number): Promise<Service> => {
  const response: AxiosResponse<Service> = await axiosInstance.get<Service>(`/servicios/${serviceId}`);
  return response.data;
};

// Método para crear nuevos servicios
export const createService = async (serviceData: { id_catserv: number; nombre: string; preciosiniva: number; preciofinal: number; iva: number }) => {
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

// Método para actualizar servicios
export const updateService = async (serviceData: { id_servicio: number; id_catserv: number; nombre: string; preciosiniva: number; preciofinal: number; iva: number }) => {
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

// Método para eliminar servicios
export const deleteService = async (serviceId: number) => {
  try {
    const response = await axiosInstance.delete(`/servicios/${serviceId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
