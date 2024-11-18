import React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Tooltip } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";

interface BarChartProps {
  data: { month: string; value: number }[]; // Datos para el gráfico
  title: string; // Título del gráfico
  description: string; // Descripción del gráfico
  footerText?: string; // Texto opcional para el footer
  trendingNumber: number; // Número que indica la tendencia (positivo o negativo)
}

const BarChartComponent: React.FC<BarChartProps> = ({ data, title, description, footerText, trendingNumber }) => {
  const isTrendingUp = trendingNumber >= 0;
  const currentMonth = new Date().toLocaleDateString("es-ES", {
    month: "long",
  }); 
  return (
    <div className="flex w-full flex-col gap-6bg-white ">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {/* Contenido del Gráfico */}
      <div className="flex justify-center items-center min-h-[300px] min-w-[500px]">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
          style={{ cursor: "pointer" }} // Mantener cursor tipo pointer
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)} // Muestra abreviatura del mes
            className="text-gray-600"
          />
          <Tooltip
            cursor={{
              fill: isTrendingUp ? "rgba(0, 229, 153, 0.07)" : "rgba(255, 90, 90, 0.07)", // Verde translúcido o rojo translúcido
            }}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
            }}
            formatter={(value) => [`${value}`, "Total"]} // Reemplaza "Value" por "Total"
          />
          <Bar dataKey="value" 
            fill={isTrendingUp ? "#00E599" : "#FF5A5A"} // Color dinámico del chart
            radius={[8, 8, 0, 0]}>
            <LabelList
              dataKey="value"
              position="top"
              offset={10}
              className="fill-gray-700 font-semibold"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </div>

      {/* Footer */}
      <div className="mt-2 text-gray-700 text-center">
        <div
          className={`flex items-center justify-center gap-2 font-medium ${isTrendingUp ? "text-customGreen" : "text-red-500"
            }`}
        >          
          <span>
            Se {isTrendingUp ? "aumentaron" : "redujeron"} las ganancias en un {Math.abs(trendingNumber)}% en {currentMonth} comparado al mes anterior.
          </span>
          {isTrendingUp ? (
            <TrendingUp className="h-5 w-5" />
          ) : (
            <TrendingDown className="h-5 w-5" />
          )}
        </div>
        <p className="text-sm text-gray-500">{footerText || "Showing data for the selected period"}</p>
      </div>
    </div>
  );
};

export default BarChartComponent;
