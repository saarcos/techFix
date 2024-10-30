// src/services/EquipoService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
export interface Equipo {
  id_equipo: number;
  id_cliente: number;
  id_tipoe: number;
  marca_id: number;  // Cambiado de id_marca a marca_id
  id_modelo: number;
  nserie: string;
  descripcion: string;
  cliente: {
    nombre: string;
    apellido: string;
  };
  tipoEquipo: {
    nombre: string;
  };
  modelo: {
    nombre: string;
    marca: {
      nombre: string;  // La marca ahora está dentro de modelo
    };
  };
}
//Método para recuperar los equipos
export const getEquipos = async (): Promise<Equipo[]> => {
    const response: AxiosResponse<Equipo[]> = await axiosInstance.get<Equipo[]>('/equipos');
    return response.data;
};
// Método para recuperar un equipo por ID (getEquipoById)
export const getEquipoById = async (equipoId: number): Promise<Equipo> => {
  const response: AxiosResponse<Equipo> = await axiosInstance.get<Equipo>(`/equipos/${equipoId}`);
  return response.data;
};
//Método para crear nuevos equipos
export const createEquipo = async (equipoData: { id_cliente: number; id_tipoe: number; marca_id: number; id_modelo: number; nserie: string; descripcion: string;}) => {
  try {
    const response = await axiosInstance.post('/equipos', equipoData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para actualizar equipos
export const updateEquipo = async (equipoData: { id_equipo: number; id_cliente: number; id_tipoe: number; marca_id: number; id_modelo: number; nserie: string; descripcion: string;}) => {
  try {
    const response = await axiosInstance.put(`/equipos/${equipoData.id_equipo}`, equipoData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para eliminar equipos
export const deleteEquipo = async (EquipoId: number) => {
  try {
    const response = await axiosInstance.delete(`/equipos/${EquipoId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
export const countEquipos = async (data: {id_tipoe: number; marca_id: number; id_modelo: number}) =>{
  try {
    const response = await axiosInstance.post(`/equipos/generar-numero-serie`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
}
export const countRepairs = async (id_equipo: number) => {
  try {
    const response = await axiosInstance.get(`/equipos/count-repairs/${id_equipo}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
}
