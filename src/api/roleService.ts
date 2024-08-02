import { AxiosResponse } from 'axios';
import axiosInstance from '../api/axiosInstance';
// import axios from 'axios';

export interface Role{
    id_rol: number;
    nombrerol:string;
    descripcion: string;
}

export const getRoles = async (): Promise<Role[]> => {
    const response: AxiosResponse<Role[]> = await axiosInstance.get<Role[]>('/roles');
    return response.data;
};