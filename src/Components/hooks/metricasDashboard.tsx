import { useQuery } from '@tanstack/react-query';
import { getGlobalMetricsOrdenes, getMonthlyEarnings, getOrdenesMetrics, getRecentOrders, getRecurrentClients, MonthlyEarnings } from "@/api/ordenTrabajoService";
import { getNewClientsThisMonth } from '@/api/clientService';
import { getProductStockAndSales, getTecnicosPerformance } from '@/api/detalleOrdenService';

export const useOrdenesMetrics = () => {
    return useQuery({
      queryKey: ["ordenesMetrics"], // Clave única para la consulta
      queryFn: getOrdenesMetrics, // Función que obtiene los datos
      staleTime: 60000, // 1 minuto para mantener la caché fresca
      refetchOnWindowFocus: true, // Refrescar datos al enfocar la ventana
    });
};
export const useGlobalOrdenesMetrics = () => {
    return useQuery({
      queryKey: ["globalOrdenesMetrics"], 
      queryFn: getGlobalMetricsOrdenes, 
      staleTime: 60000, 
      refetchOnWindowFocus: true, 
    });
};
export const useClientesMetrics = () => {
    return useQuery({
      queryKey: ["clientesMetrics"], 
      queryFn: getNewClientsThisMonth, 
      staleTime: 60000, 
      refetchOnWindowFocus: true, 
    });
};
export const useRecurrentClientesMetrics = () => {
    return useQuery({
      queryKey: ["recurrentClientesMetrics"], 
      queryFn: getRecurrentClients, 
      staleTime: 60000, 
      refetchOnWindowFocus: true, 
    });
};
export const useRecentOrdersMetrics = () => {
    return useQuery({
      queryKey: ["recentOrdersMetrics"], 
      queryFn: getRecentOrders, 
      staleTime: 60000, 
      refetchOnWindowFocus: true, 
    });
};
export const useMonthlyEarnings = () => {
    return useQuery<MonthlyEarnings[]>({
      queryKey: ["monthlyEarnings"], // Clave única para la consulta
      queryFn: getMonthlyEarnings, // Función para obtener los datos
      staleTime: 60000, // Caché por 1 minuto
      refetchOnWindowFocus: true, // Refrescar datos al enfocar la ventana
    });
};
export const useTechnicianPerformance = () => {
    return useQuery({
      queryKey: ['technicianPerformance'],
      queryFn: getTecnicosPerformance,
      staleTime: 60000, // Cachear por 1 minuto
      refetchOnWindowFocus: true,
    });
};
export const useTopProducts  = () => {
    return useQuery({
      queryKey: ['topProducts'],
      queryFn: getProductStockAndSales,
      staleTime: 60000, // Cachear por 1 minuto
      refetchOnWindowFocus: true,
    });
};