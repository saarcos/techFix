import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from  "@/Components/ui/card";// Ajusta la ruta según tu proyecto
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from  "@/Components/ui/chart";// Ajusta la ruta según tu proyecto

// Props del componente
interface ProductStockChartProps {
  data: {
    product: string; // Nombre del producto
    stock: number; // Stock disponible
    used: number; // Cantidad utilizada
  }[];
}

// Configuración del gráfico
const chartConfig: ChartConfig = {
  stock: {
    label: "Stock",
    color: "#00E599",
  },
  used: {
    label: "Usados",
    color: "#ef4444",
  },
};

const ProductStockChart: React.FC<ProductStockChartProps> = ({ data }) => {
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>Inventario por Producto</CardTitle>
        <CardDescription>
          Productos más demandados y su stock disponible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} style={{ cursor: "pointer" }} // Mantener cursor tipo pointer
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            {/* Eje X con los nombres de los productos */}
            <XAxis
              dataKey="product"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />

            {/* Tooltip personalizado */}
            <ChartTooltip content={<ChartTooltipContent hideLabel={true} cursor={{fill:"rgba(0, 229, 153, 0.07)"}}/>} />

            {/* Leyenda personalizada */}
            <ChartLegend content={<ChartLegendContent />} />

            {/* Barras apiladas */}
            <Bar
              dataKey="stock"
              stackId="a"
              fill={chartConfig.stock.color}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="used"
              stackId="a"
              fill={chartConfig.used.color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col text-sm">
        <div className="leading-none text-muted-foreground">
          Muestra los productos más demandados junto al stock disponible.
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductStockChart;
