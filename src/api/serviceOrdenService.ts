// src/services/ServicioOrdenService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

// Definir la interfaz para un servicio en una orden
export interface ServicioOrden {
  id_servorden: number;
  id_servicio: number;
  id_orden: number;
  servicio: {
    nombre: string;
    precio: number;
  };
}

// Método para obtener todos los servicios de una orden (getServicesByOrderId)
export const getServicesByOrderId = async (orderId: number): Promise<ServicioOrden[]> => {
  try {
    const response: AxiosResponse<ServicioOrden[]> = await axiosInstance.get<ServicioOrden[]>(`/ordenes/${orderId}/servicios`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado al obtener los servicios de la orden');
    }
  }
};

// Método para agregar varios servicios a una orden (addServicesToOrder)
export const addServicesToOrder = async (orderId: number, servicios: { id_servicio: number }[]): Promise<ServicioOrden[]> => {
  try {
    const response: AxiosResponse<ServicioOrden[]> = await axiosInstance.post<ServicioOrden[]>(`/ordenes/${orderId}/servicios`, {
      id_orden: orderId,
      servicios,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado al agregar los servicios a la orden');
    }
  }
};

// Método para actualizar un servicio en una orden (updateServiceInOrder)
export const updateServiceInOrder = async (id_servorden: number, id_servicio: number): Promise<ServicioOrden> => {
  try {
    const response: AxiosResponse<ServicioOrden> = await axiosInstance.put<ServicioOrden>(`/serviciosorden/${id_servorden}`, {
      id_servicio,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado al actualizar el servicio en la orden');
    }
  }
};

// Método para eliminar un servicio de una orden (deleteServiceFromOrder)
export const deleteServiceFromOrder = async (id_servorden: number): Promise<void> => {
  try {
    const response: AxiosResponse<void> = await axiosInstance.delete<void>(`/serviciosorden/${id_servorden}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado al eliminar el servicio de la orden');
    }
  }
};
