import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart";

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

  return (
    <Card className="flex flex-col border-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Empleado del mes</CardTitle>
        <CardDescription className="sm:justify-center sm:items-center">Ganancias generadas por cada técnico</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
        {/* Contenedor del gráfico */}
        <ChartContainer
          className="aspect-square w-full max-w-[300px] min-h-[300px] sm:max-w-[400px] lg:w-2/3"
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
              content={<ChartTooltipContent />}
            />
            <Pie
              data={chartData}
              dataKey="revenue"
              nameKey="technician"
              innerRadius="50%" // Mejora el tamaño del anillo
              outerRadius="70%" // Ajusta el radio externo
              strokeWidth={5}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
              labelLine={false} // Ocultar la línea de la label
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
                        dominantBaseline="central"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          ${chartData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
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
        {/* Leyenda */}
        <div className="flex flex-col gap-4 w-full lg:w-1/3 text-center lg:text-left lg:py-20">
          <h3 className="text-lg font-semibold text-gray-800">Leyenda</h3>
          <ul className="flex flex-wrap lg:flex-col gap-2 justify-center lg:justify-start">
            {chartData.map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.fill }}
                ></span>
                <span className="text-sm text-gray-600">
                  {item.technician}: ${item.revenue.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex-col text-sm">
        <div className="leading-none text-muted-foreground">
          Muestra las ganancias por técnico del mes de Noviembre.
        </div>
      </CardFooter>
    </Card>
  );
};

export default TechnicianPerformanceChart;
