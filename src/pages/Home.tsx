import { useAuth } from "@/Components/AuthProvider";
import CardHome from "@/Components/CardHome";
import BarChartComponent from "@/Components/charts/barChart";
import TechnicianPerformanceChart from "@/Components/charts/pieChart";
import ProductStockChart from "@/Components/charts/stackedBarChart";
import SalesCard from "@/Components/SalesCard";
import { CardContent } from "@/Components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { Activity, Calendar, CreditCard, DollarSign, Info, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cardData = [
    {
      label: "Total Revenue",
      amount: 45231.89,
      percentage: 20.1,
      description: "from last month",
      icon: DollarSign,
    },
    {
      label: "Subscriptions",
      amount: 2350,
      percentage: -5,
      description: "from last month",
      icon: Users,
    },
    {
      label: "Sales",
      amount: 12234,
      percentage: 19,
      description: "from last month",
      icon: CreditCard,
    },
    {
      label: "Active Now",
      amount: 573,
      percentage: -10,
      description: "since last hour",
      icon: Activity,
    },
  ];

  const customersSalesData = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      saleAmount: 1999.0,
    },
    {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      saleAmount: 1999.0,
    },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      saleAmount: 39.0,
    },
    {
      name: "William Kim",
      email: "will@email.com",
      saleAmount: 299.0,
    },
    {
      name: "Sofia Davis",
      email: "sofia.davis@email.com",
      saleAmount: 39.0,
    },
  ];

  const testData = [
    { month: "January", value: 186 },
    { month: "February", value: 305 },
    { month: "March", value: 237 },
    { month: "April", value: 73 },
    { month: "May", value: 209 },
    { month: "June", value: 214 },
  ];

  const technicianData = [
    { technician: "John Doe", revenue: 1500 },
    { technician: "Jane Smith", revenue: 2000 },
    { technician: "Sam Lee", revenue: 1000 },
    { technician: "Emma Wilson", revenue: 1800 },
    { technician: "Jack Taylor", revenue: 900 },
  ];
  const productData = [
    { product: "Cargador", stock: 50, used: 30 },
    { product: "Batería", stock: 20, used: 40 },
    { product: "Pantalla", stock: 10, used: 25 },
    { product: "Teclado", stock: 35, used: 10 },
    { product: "Mouse", stock: 45, used: 15 },
  ];

  return (
    <div className="flex flex-col gap-6 w-full p-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full py-4 gap-4 lg:gap-0">
        {/* Texto de bienvenida y descripción */}
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
            Bienvenido de nuevo, {user?.nombre} 👋
          </h1>
          <p className="text-sm lg:text-base text-gray-500 mt-2">
            Aquí tienes un resumen de las métricas recientes sobre el taller.
          </p>
        </div>

        {/* Fecha con ícono */}
        <div className="flex items-center gap-2">
          <div className="flex items-center text-sm lg:text-base text-gray-500 gap-2">
            <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
            <span>
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
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
          />
        ))}
      </section>

      {/* Sección de Gráficos y Ventas */}
      <section className="grid w-full grid-cols-1 gap-6 transition-all lg:grid-cols-2">
        {/* Tabla de Ventas */}
        <CardContent className="flex flex-col gap-4 rounded-xl border p-6 shadow">
          <section className="flex justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Órdenes recientes</h2>
              <p className="text-sm text-gray-500">Haz iniciado 245 órdenes este mes.</p>
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
            {customersSalesData.slice(0, 5).map((customer, i) => (
              <SalesCard
                key={i}
                email={customer.email}
                name={customer.name}
                saleAmount={customer.saleAmount}
              />
            ))}
          </div>
        </CardContent>
        {/* Gráfico de Barras */}
        <CardContent className="flex flex-col gap-4 rounded-xl border p-6 shadow">
          <BarChartComponent
            data={testData}
            title="Monthly Earnings"
            description="Revenue from January to June"
            footerText="Showing total earnings for the last 6 months"
          />
        </CardContent>
        {/* Gráfico Circular */}
        <CardContent className="flex flex-col gap-4 rounded-xl border p-6 shadow">
          <TechnicianPerformanceChart data={technicianData} />
        </CardContent>
        <CardContent className="flex flex-col gap-4 rounded-xl border p-6 shadow">
          <ProductStockChart data={productData} />
        </CardContent>
      </section>
    </div>
  );
};
export default Home;
