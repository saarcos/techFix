import axios, { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';

// Definimos la interface para Accesorio
export interface Notificacion {
    id_notificacion: number;
    id_usuario: string;
    id_referencia: number;
    mensaje: string;
    leida: boolean;
    created_at: Date;
}

// Método para recuperar las notificaciones no leídas por usuario
export const getNotificacionesByUserId = async (userId: number): Promise<Notificacion[]> => {
  const response: AxiosResponse<Notificacion[]> = await axiosInstance.get<Notificacion[]>(`/notificaciones/${userId}`);
  return response.data;
};
//Método para marcar una notificación como leída
export const readNotification = async (id_notificacion: number) => {
    try {
      const response = await axiosInstance.put(`/notificaciones/${id_notificacion}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data;
      } else {
        throw new Error('Error inesperado');
      }
    }
  };