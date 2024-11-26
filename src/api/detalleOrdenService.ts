// src/services/DetalleOrdenService.ts
import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

export interface DetalleOrden {
    id_detalle: number;
    id_orden: number;
    id_usuario?: number | null; // Permitimos null para cuando no haya usuario asignado
    id_servicio?: number;
    id_producto?: number;
    precioservicio?: number;
    precioproducto?: number;
    cantidad: number;
    preciototal: number;
    status: boolean;
    producto?: {
        nombreProducto: string;
        preciofinal: number;
    }
    servicio?: {
        nombre: string;
        preciofinal: number;
    }
}
export interface PerformanceTecnicos {
    technician_name: string;
    total_revenue: string;
}
export interface ProductosMasVendidos {
    product: string,
    stock: number;
    used: number;
}

// Crear múltiples detalles de orden con verificación de stock (createDetallesOrden)
export const createDetallesOrden = async (detallesOrdenData: Partial<DetalleOrden>[]): Promise<DetalleOrden[]> => {
    try {
        const response: AxiosResponse<DetalleOrden[]> = await axiosInstance.post('/detalleorden', { detalles: detallesOrdenData });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Error inesperado al crear los detalles de orden');
        } else {
            throw new Error('Error inesperado'); // Otro tipo de errores
        }
    }
};

// Obtener todos los detalles de una orden (getDetallesOrden)
export const getDetallesOrden = async (): Promise<DetalleOrden[]> => {
    try {
        const response: AxiosResponse<DetalleOrden[]> = await axiosInstance.get('/detalleorden');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Error inesperado al crear el detalle de orden');
        } else {
            throw new Error('Error inesperado'); // Otro tipo de errores
        }
    }
};

// Obtener un detalle de orden por ID (getDetalleOrdenById)
export const getDetallesByOrdenId = async (detalleOrdenId: number): Promise<DetalleOrden[]> => {
    try {
        const response: AxiosResponse<DetalleOrden[]> = await axiosInstance.get(`/detalleorden/${detalleOrdenId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Error inesperado al crear el detalle de orden');
        } else {
            throw new Error('Error inesperado'); // Otro tipo de errores
        }
    }
};

// Actualizar un detalle de orden (updateDetalleOrden)
export const updateDetalleOrden = async (detalleOrdenId: number, detalleOrdenData: Partial<DetalleOrden>): Promise<DetalleOrden> => {
    try {
        const response: AxiosResponse<DetalleOrden> = await axiosInstance.put(`/detalleorden/${detalleOrdenId}`, detalleOrdenData);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Error inesperado al crear el detalle de orden');
        } else {
            throw new Error('Error inesperado'); // Otro tipo de errores
        }
    }
};
// Eliminar un detalle de orden y restablecer el stock (deleteDetalleOrden)
export const deleteDetalleOrden = async (detalleOrdenId: number): Promise<void> => {
    try {
        const response = await axiosInstance.delete(`/detalleorden/${detalleOrdenId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw error.response?.data || new Error('Error inesperado al crear el detalle de orden');
        } else {
            throw new Error('Error inesperado'); // Otro tipo de errores
        }
    }
};

export const getTecnicosPerformance = async (): Promise<PerformanceTecnicos[]> => {
    try {
      const response: AxiosResponse<PerformanceTecnicos[]> = await axiosInstance.get<PerformanceTecnicos[]>('/detalleorden/performanceTecnicos');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data; // Manejo de errores específicos de Axios
      } else {
        throw new Error('Error inesperado'); // Otro tipo de errores
      }
    }
};
