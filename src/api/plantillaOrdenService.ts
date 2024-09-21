import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

// Interface para representar una relación Plantilla-Orden
export interface PlantillaOrden {
  id_plantillaorden: number;
  id_orden: number;
  id_grupo: number;
}

// Método para asignar múltiples plantillas a una orden
export const createMultiplePlantillasOrden = async (id_orden: number, plantillas: number[]): Promise<PlantillaOrden[]> => {
  try {
    const response: AxiosResponse<PlantillaOrden[]> = await axiosInstance.post<PlantillaOrden[]>('/plantillaorden/multiple', {
      id_orden,
      plantillas,
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

// Método para obtener todas las relaciones entre plantillas y órdenes
export const getAllPlantillasOrden = async (): Promise<PlantillaOrden[]> => {
  try {
    const response: AxiosResponse<PlantillaOrden[]> = await axiosInstance.get<PlantillaOrden[]>('/plantillaorden');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

// Método para eliminar una relación Plantilla-Orden por ID
export const deletePlantillaOrden = async (id_plantillaorden: number): Promise<void> => {
  try {
    const response: AxiosResponse<void> = await axiosInstance.delete<void>(`/plantillaorden/${id_plantillaorden}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
