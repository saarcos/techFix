import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
} from "@/Components/ui/chart";
import React from "react";
import { useMediaQuery } from 'react-responsive';


interface TechnicianPerformanceChartProps {
  data: {
    technician: string;
    revenue: number;
  }[];
}

const colors = ["#00E599", "#ef4444", "#36A2EB", "#FFD93D", "#4BC0C0", "#9966FF"];

const TechnicianPerformanceChart: React.FC<TechnicianPerformanceChartProps> = ({ data }) => {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length], // Asignar un color único por técnico
  }));

  const totalRevenue = React.useMemo(
    () => chartData.reduce((sum, item) => sum + item.revenue, 0),
    [chartData]
  );

  // Detectar resolución móvil
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <Card className="relative flex flex-col border-none shadow-none bg-gradient-to-br"> {/* Añadido relative */}
      <CardHeader className="relative items-center pb-2 pt-0"> {/* Reducir paddings */}
        <CardTitle className="text-gray-700 font-medium text-lg">
          Empleado del mes
        </CardTitle>
        <CardDescription className="text-sm text-gray-500 hidden lg:block">
          Ganancias generadas por técnico
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0 pt-0"> {/* Reducir padding inferior */}
        {/* Ícono del martillo */}
        <div className="flex justify-center items-center">
          <ChartContainer
            className="aspect-square w-full max-w-[180px] max-h-40" // Compactar gráfico
            config={{
              technicians: { label: "Technicians" },
              ...Object.fromEntries(
                data.map((item, index) => [
                  item.technician,
                  { label: item.technician, color: colors[index % colors.length] },
                ])
              ),
            }}
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    const color = data.payload?.fill || "#000"; // Preservar el color del gráfico
                    return (
                      <div className="bg-white border border-gray-300 shadow-md p-2 rounded text-sm flex items-center gap-2">
                        {/* Cuadro de color */}
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        ></span>
                        {/* Texto del tooltip */}
                        <div>
                          <span className="block font-normal text-gray-800">
                            {data.name || "N/A"} {/* Nombre del técnico */}
                          </span>
                          <span className="block text-gray-500">
                            ${data.value ? data.value.toLocaleString() : "0"} {/* Valor con formato */}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                dataKey="revenue"
                nameKey="technician"
                innerRadius={50} // Compactar radios
                strokeWidth={5}
                style={{ cursor: "pointer" }} // Mantener cursor tipo pointer
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            ${totalRevenue.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Ganancias
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
        {isMobile && (
          <div
            className="mt-4 flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-700 justify-center"
          >
            {chartData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-start"
                style={{ minWidth: "45%" }} // Ocupa la mitad del ancho disponible
              >
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.fill }}
                ></span>
                <span className="flex-1">{item.technician}</span>
                <span className="font-medium ml-1">${item.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicianPerformanceChart;
