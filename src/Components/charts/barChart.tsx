import React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";

interface BarChartProps {
  data: { month: string; value: number }[]; // Datos para el gráfico
  title: string; // Título del gráfico
  description: string; // Descripción del gráfico
  footerText?: string; // Texto opcional para el footer
  trendingNumber: number; // Número que indica la tendencia (positivo o negativo)
}

const BarChartComponent: React.FC<BarChartProps> = ({ data, title, description, trendingNumber }) => {
  const isTrendingUp = trendingNumber >= 0;
  const currentMonth = new Date().toLocaleDateString("es-ES", {
    month: "long",
  });

  return (
    <div className="flex w-full flex-col flex-grow">
      {/* Títulos */}
      <div className="mb-2">
        <h2 className="text-base sm:text-lg md:text-lg lg:text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm sm:text-base text-gray-500">{description}</p>
      </div>

      {/* Contenido del Gráfico */}
      <div className="flex-grow w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 20,
              bottom: 10,
            }}
            style={{ cursor: "pointer" }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)} // Muestra abreviatura del mes
              className="text-gray-600 text-sm"
            />
            <Tooltip
              cursor={{
                fill: isTrendingUp ? "rgba(0, 229, 153, 0.07)" : "rgba(255, 90, 90, 0.07)",
              }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              formatter={(value) => [`${value}`, "Total"]}
            />
            <Bar
              dataKey="value"
              fill={isTrendingUp ? "#00E599" : "#FF5A5A"}
              radius={[8, 8, 0, 0]}
            >
              <LabelList
                dataKey="value"
                position="top"
                offset={10}
                className="fill-gray-700 font-semibold text-sm"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-2 text-gray-700 text-center">
        <div
          className={`flex items-center justify-center gap-2 text-sm sm:text-base lg:font-medium ${
            isTrendingUp ? "text-customGreen" : "text-red-500"
          }`}
        >
          <span>
            Se {isTrendingUp ? "aumentaron" : "redujeron"} las ganancias en un{" "}
            {Math.abs(trendingNumber)}% en {currentMonth} comparado al mes anterior
          </span>
          {isTrendingUp ? (
            <TrendingUp className="h-5 w-5" />
          ) : (
            <TrendingDown className="h-5 w-5" />
          )}
        </div>
      </div>
    </div>
  );
};

export default BarChartComponent;
