// src/services/tiposequiposService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
export interface DeviceType {
  id_tipoe: number;
  nombre: string;
}
//Método para recuperar los tiposequipos
export const getDeviceTypes = async (): Promise<DeviceType[]> => {
    const response: AxiosResponse<DeviceType[]> = await axiosInstance.get<DeviceType[]>('/tiposequipos');
    return response.data;
};
// Método para recuperar una marca por ID (getDeviceTypeById)
export const getDeviceTypeById = async (DeviceTypeId: number): Promise<DeviceType> => {
  const response: AxiosResponse<DeviceType> = await axiosInstance.get<DeviceType>(`/tiposequipos/${DeviceTypeId}`);
  return response.data;
};
//Método para crear nuevas tiposequipos
export const createDeviceType = async (DeviceTypeData: { nombre: string}) => {
  try {
    const response = await axiosInstance.post('/tiposequipos', DeviceTypeData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para actualizar tiposequipos
export const updateDeviceType = async (DeviceTypeData: { id_tipoe:number, nombre: string;}) => {
  try {
    const response = await axiosInstance.put(`/tiposequipos/${DeviceTypeData.id_tipoe}`, DeviceTypeData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para eliminar tiposequipos
export const deleteDeviceType = async (DeviceTypeId: number) => {
  try {
    const response = await axiosInstance.delete(`/tiposequipos/${DeviceTypeId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
