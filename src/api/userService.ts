// src/services/userService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';

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

