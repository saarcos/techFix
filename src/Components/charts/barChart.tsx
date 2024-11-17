import React from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

interface BarChartProps {
  data: { month: string; value: number }[]; // Datos para el gráfico
  title: string; // Título del gráfico
  description: string; // Descripción del gráfico
  footerText?: string; // Texto opcional para el footer
}

const BarChartComponent: React.FC<BarChartProps> = ({ data, title, description, footerText }) => {
  return (
    <div className="flex w-full flex-col gap-6bg-white ">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {/* Contenido del Gráfico */}
      <div className="flex justify-center items-center cursor-pointer">
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
                fill: "rgba(0, 229, 153, 0.07)", // Fondo translúcido más suave
              }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "14px",
              }}
          />
          <Bar dataKey="value" fill="#00E599" radius={[8, 8, 0, 0]}>
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
        <div className="flex items-center justify-center gap-2 text-customGreen font-medium">
          <span>Trending up by 5.2% this month</span>
          <TrendingUp className="h-5 w-5" />
        </div>
        <p className="text-sm text-gray-500">{footerText || "Showing data for the selected period"}</p>
      </div>
    </div>
  );
};

export default BarChartComponent;
