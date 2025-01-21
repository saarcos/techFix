// src/services/userService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
export interface User {
  id_usuario: number;
  nombre: string;
  apellido: string;
  id_rol: number;
  email: string;
  password_hash: string;
  rol: {
    nombrerol: string;
  };
}
//Método para recuperar los usuarios
export const getUsers = async (): Promise<User[]> => {
    const response: AxiosResponse<User[]> = await axiosInstance.get<User[]>('/usuarios');
    return response.data;
};
// Método para recuperar un usuario por ID (getUserById)
export const getUserById = async (userId: number): Promise<User> => {
  const response: AxiosResponse<User> = await axiosInstance.get<User>(`/usuarios/${userId}`);
  return response.data;
};
//Método para crear nuevos usuarios
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
//Método para actualizar usuarios
export const updateUsuario = async (usuarioData: {id_usuario: number, nombre: string; apellido: string; email: string; password_hash: string; id_rol: number }) => {
  try {
    const response = await axiosInstance.put(`/usuarios/${usuarioData.id_usuario}`, usuarioData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para actualizar usuarios
export const updateUsuariobyTecnico = async (usuarioData: {id_usuario: number, nombre: string; apellido: string; email: string; password_hash: string; }) => {
  try {
    const response = await axiosInstance.put(`/usuarios/modificar-tecnico/${usuarioData.id_usuario}`, usuarioData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
//Método para eliminar usuarios
export const deleteUser = async (userId: number) => {
  try {
    const response = await axiosInstance.delete(`/usuarios/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    } else {
      throw new Error('Error inesperado');
    }
  }
};
