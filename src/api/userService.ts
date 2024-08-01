// src/services/userService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
export interface User {
  id: number;
  nombre: string;
  apellido: string;
  id_rol: number;
  email: string;
  rol: {
    nombrerol: string;
  };
}

export const getUsers = async (): Promise<User[]> => {
    const response: AxiosResponse<User[]> = await axiosInstance.get<User[]>('/usuarios');
    return response.data;
};
export const createUsuario = async (usuarioData: { nombre: string; apellido: string; email: string; password_hash: string; id_rol: number }) => {
  try {
    const response = await axiosInstance.post('/usuarios', usuarioData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};

