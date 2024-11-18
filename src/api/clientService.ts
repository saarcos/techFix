// src/services/ClientService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
export interface Client {
  id_cliente: number;
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  celular: string;
  tipo_cliente: string;
}
export interface ClientesMetrics {
  newClients: number;
  percentageChange: number;
  previousMonthClients: number;
}
//Método para recuperar los clientes
export const getClients = async (): Promise<Client[]> => {
    const response: AxiosResponse<Client[]> = await axiosInstance.get<Client[]>('/clientes');
    return response.data;
};
// Método para recuperar un usuario por ID (getClientById)
export const getClientById = async (ClientId: number): Promise<Client> => {
  const response: AxiosResponse<Client> = await axiosInstance.get<Client>(`/clientes/${ClientId}`);
  return response.data;
};
//Método para crear nuevos clientes
export const createCliente = async (clienteData: { nombre: string; apellido: string; cedula: string; correo: string; celular: string }) => {
  try {
    const response = await axiosInstance.post('/clientes', clienteData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para actualizar clientes
export const updateCliente = async (clienteData: { id_cliente:number, nombre: string; apellido: string; cedula: string; correo: string; celular: string }) => {
  try {
    const response = await axiosInstance.put(`/clientes/${clienteData.id_cliente}`, clienteData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para eliminar clientes
export const deleteClient = async (ClientId: number) => {
  try {
    const response = await axiosInstance.delete(`/clientes/${ClientId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
export const getNewClientsThisMonth = async (): Promise<ClientesMetrics> => {
  try {
    const response: AxiosResponse<ClientesMetrics> = await axiosInstance.get<ClientesMetrics>('/clientes/metrics');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data; // Manejo de errores específicos de Axios
    } else {
      throw new Error('Error inesperado'); // Otro tipo de errores
    }
  }
};
