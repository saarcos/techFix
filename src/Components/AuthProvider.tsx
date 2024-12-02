import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { getNotificacionesByUserId, Notificacion } from '@/api/notificacionesService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  socket: Socket | null;
  notificaciones: Notificacion[] | undefined;
}

interface User {
  id_usuario: number;
  nombre: string;
  email: string;
  id_rol: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = 'http://localhost:3000';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const queryClient = useQueryClient();

  const { data: notificaciones } = useQuery<Notificacion[]>({
    queryKey: ['notificaciones', user?.id_usuario], // Clave de consulta dinámica por usuario
    queryFn: () => {
      if (!user?.id_usuario) {
        // Devuelve un array vacío temporalmente si el usuario aún no está cargado
        return Promise.resolve([]);
      }
      return getNotificacionesByUserId(user.id_usuario);
    },
    enabled: !!user, // Solo se ejecuta si hay un usuario autenticado
    initialData: [], // Devuelve un array vacío antes de que la consulta se complete
  });
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/check-auth`, { withCredentials: true });
        setIsAuthenticated(response.data.isAuthenticated);
        setUser(response.data.user);
         // Si el usuario está autenticado, conectar a Socket.IO
         if (response.data.isAuthenticated && response.data.user) {
          const newSocket = io(API_URL); // Inicializar Socket.IO
          newSocket.emit('register', response.data.user.id_usuario); // Registrar al usuario en el servidor
          console.log(`Usuario registrado en Socket.IO con userId: ${response.data.user.id_usuario}`);
          setSocket(newSocket);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    checkAuth();
  }, []);
  useEffect(() => {
    if (socket) {
      // Escuchar notificaciones de órdenes asignadas
      socket.on('ordenAsignada', (data) => {
        console.log('Notificación recibida:', data);
        toast.success(data.message); // Mostrar la notificación
        queryClient.invalidateQueries({ queryKey: ['notificaciones'] });
      });

      return () => {
        // Desconectar el socket al desmontar
        socket.disconnect();
      };
    }
  }, [socket, queryClient]);
  

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
      setIsAuthenticated(true);
      setUser(response.data.user);

      const newSocket = io(API_URL);
      newSocket.emit('register', response.data.user.id_usuario);
      console.log(`Usuario registrado en Socket.IO con userId: ${response.data.user.id_usuario}`);
      setSocket(newSocket);

      newSocket.on('ordenAsignada', (data) => {
        console.log('Notificación recibida:', data);
        toast.success(data.message);
      });
    } catch (error) {
      console.error('Error de autenticación', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);

      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, socket, notificaciones}}>
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
