import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { getNotificacionesByUserId, Notificacion } from '@/api/notificacionesService';
import { useQuery } from '@tanstack/react-query';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  notificaciones: Notificacion[] | undefined;
}

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  id_rol: number;
  rol: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = 'http://localhost:3000';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const { data: notificaciones } = useQuery<Notificacion[]>({
    queryKey: ['notificaciones', user?.id],
    queryFn: () => {
      if (!user?.id) return Promise.resolve([]); // Evitar consulta si no hay usuario
      return getNotificacionesByUserId(user.id);
    },
    enabled: !!user?.id, // Habilitar solo si hay usuario
    initialData: [],
  });


  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/check-auth`, { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
        setUser(response.data.user || null);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
      setIsAuthenticated(true);
      setUser(response.data.user || null);
    } catch (error) {
      // Verifica si el error es un AxiosError
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.error || 'Error desconocido';
        throw new Error(errorMessage); // Lanza un error con el mensaje específico del backend
      }
      throw new Error('Error desconocido al iniciar sesión');
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, notificaciones }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
