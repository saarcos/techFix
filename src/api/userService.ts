import apiClient from './apiClient';
import { AxiosError } from 'axios';

export const createUsuario = async (usuarioData: { nombre: string; apellido: string; email: string; password: string; id_rol: number }) => {
  try {
    const response = await apiClient.post('/usuarios', usuarioData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Error de respuesta del servidor:', error.response.data);
        throw error.response.data;
      } else if (error.request) {
        // La solicitud fue hecha pero no hubo respuesta
        console.error('Error de solicitud:', error.request);
        throw new Error('No response from server');
      } else {
        // Algo pasó al configurar la solicitud
        console.error('Error al configurar la solicitud:', error.message);
        throw new Error('Request setup error');
      }
    } else {
      console.error('Error desconocido:', error);
      throw new Error('Unknown error');
    }
  }
};
