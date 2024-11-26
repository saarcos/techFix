import CardHome from "@/Components/CardHome";
import BarChartComponent from "@/Components/charts/barChart";
import TechnicianPerformanceChart from "@/Components/charts/pieChart";
import { useClientesMetrics, useGlobalOrdenesMetrics, useMonthlyEarnings, useOrdenesMetrics, useRecentOrdersMetrics, useTechnicianPerformance } from "@/Components/hooks/metricasDashboard";
import SalesCard from "@/Components/SalesCard";
import Spinner from "../assets/tube-spinner.svg";
import { CardContent } from "@/Components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import {  CreditCard, DollarSign, HandCoinsIcon, Info, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChartCard from "@/Components/charts/chartCard";

const Home = () => {
  const navigate = useNavigate();
  const currentMonth = new Date().toLocaleDateString("es-ES", {
    month: "long",
  });
  const { data, isLoading, isError } = useOrdenesMetrics();
  const { data: metricasGlobales, isLoading: areGlobalMetricsLoading, isError: globalMetricsError } = useGlobalOrdenesMetrics();
  const { data: clientesMetrics, isLoading: areClientesMetricsLoading, isError: clientesMetricsError } = useClientesMetrics();
  const { data: recentOrders, isLoading: areRecentOrdersLoading, isError: recentOrdersError } = useRecentOrdersMetrics();
  const { data: monthlyEarningsData, isLoading: isMonthlyEarningsLoading, isError: monthlyEarningsError } = useMonthlyEarnings();
  const { data: technicianPerformanceData, isLoading: isTechnicianPerformanceLoading, isError: technicianPerformanceError } = useTechnicianPerformance();

  const monthly = data?.monthly ?? { earnings: 0, change: 0 };
  const totalRecaudado = metricasGlobales?.totalRecaudado ?? 0;
  const totalOrdenes = recentOrders?.totalOrders ?? 0;
  const newClients = clientesMetrics?.newClients ?? 0;
  const percentageChange = clientesMetrics?.percentageChange ?? 0;
  // Verifica si hay datos de ganancias mensuales
  const firstMonth = monthlyEarningsData?.[0]?.month_label || "";
  const lastMonth = monthlyEarningsData?.[monthlyEarningsData.length - 1]?.month_label || "";
  // Descripción dinámica basada en los datos
  const description = `Ganancias desde ${firstMonth} a ${lastMonth}`;
  const footerText = `Muestra las ganancias totales de ${firstMonth} a ${lastMonth}`;
  const cardData = [
    {
      label: "Total Recaudado",
      amount: totalRecaudado,
      secondaryLabel: "Órdenes procesadas en total",
      secondaryValue: totalOrdenes,
      secondaryIcon: CreditCard, // Representa transacciones y órdenes procesadas
      description: "Total en ingresos",
      icon: DollarSign, // Representa dinero recaudado
      showProgress: false,
    },
    {
      label: `Ingresos Mensuales (${currentMonth})`, // Incluye el mes actual
      amount: monthly.earnings,
      percentage: monthly.change,
      description: "respecto al mes pasado",
      icon: HandCoinsIcon,
      showProgress: true,
    },
    {
      label: `Nuevos Clientes (${currentMonth})`,
      amount: newClients,
      percentage: percentageChange,
      description: "respecto al mes anterior",
      icon: Users, // Representa usuarios o clientes
      showProgress: true,
      isCurrency: false,
    },
  ];

  const barChartData = monthlyEarningsData?.map((item) => ({
    month: item.month_label,
    value: item.total_earnings,
  })) || [];

  const technicianData = technicianPerformanceData?.map((item) => ({
    technician: item.technician_name,
    revenue: parseFloat(item.total_revenue), // Asegura que sea un número
  })) || [];

  
  if (isLoading || areGlobalMetricsLoading || areClientesMetricsLoading  || areRecentOrdersLoading || isMonthlyEarningsLoading || isTechnicianPerformanceLoading )
    return (
      <div className="flex justify-center items-center h-28">
        <img src={Spinner} className="w-16 h-16" />
      </div>
    );

  if (isError || globalMetricsError || clientesMetricsError  || recentOrdersError || monthlyEarningsError || technicianPerformanceError )
    return toast.error("Error al recuperar los datos");

  return (
    <div className="flex flex-col gap-6 w-full p-6">
      {/* Tarjetas de Métricas */}
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((metrica, i) => (
          <CardHome
            key={i}
            amount={metrica.amount}
            description={metrica.description}
            Icon={metrica.icon}
            label={metrica.label}
            percentage={metrica.percentage}
            secondaryIcon={metrica?.secondaryIcon}
            secondaryLabel={metrica?.secondaryLabel}
            showProgress={metrica?.showProgress}
            secondaryValue={metrica?.secondaryValue}
            isCurrency={metrica?.isCurrency}
          />
        ))}
        <ChartCard>
          <TechnicianPerformanceChart data={technicianData} />
        </ChartCard>
      </section>
      {/* Sección de Gráficos y Ventas */}
      <section className="grid w-full grid-cols-1 gap-6 transition-all lg:grid-cols-2">
        {/* Tabla de Ventas */}
        <CardContent className="flex flex-col gap-4 rounded-xl border p-6 shadow">
          <section className="flex justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Órdenes recientes</h2>
              <p className="text-sm text-gray-500">Haz iniciado {totalOrdenes} órdenes este mes.</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info
                    className="w-6 h-6 text-gray-500 cursor-pointer hover:text-customGreen"
                    onClick={() => navigate("/taller/ordenes")}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ir a la sección de órdenes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </section>
          <div className="flex flex-col gap-3">
            {recentOrders?.recentClients.map((client, i) => (
              <SalesCard
                key={i}
                name={`${client.nombre} ${client.apellido}`}
                email={client.correo}
                saleAmount={client.total_spent}
              />
            ))}
          </div>
        </CardContent>
        {/* Gráfico de Barras */}
        <CardContent className="flex flex-col gap-4 rounded-xl border p-6 shadow">
          <BarChartComponent
            data={barChartData}
            title="Ganancias Mensuales"
            description={description}
            footerText={footerText}
            trendingNumber={monthly.change}
          />
        </CardContent>
      </section>
    </div>
  );
};
export default Home;
