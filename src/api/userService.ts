// src/services/userService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  id_rol: number;
  email: string;
}

export const getUsers = async (): Promise<User[]> => {
    const response: AxiosResponse<User[]> = await axiosInstance.get<User[]>('/usuarios');
    return response.data;
};

