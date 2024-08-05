import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Permite el envío de cookies con la solicitud
});

export default axiosInstance;
