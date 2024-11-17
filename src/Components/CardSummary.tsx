import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

interface CardSummaryProps {
  description: string; // Texto que aparece como descripción en la cabecera.
  earnings: number; // Valor a mostrar como ganancia.
  percentage: number; // Porcentaje de incremento o decremento.
  content?: string; // Texto opcional en el contenido.
  className?: string; // Clase opcional para personalizar el estilo.
}

const CardSummary = ({
  description,
  earnings,
  percentage,
  content = "Comparado con el período anterior",
  className = "",
}: CardSummaryProps) => {
  const isNegative = percentage < 0; // Verificar si el porcentaje es negativo
  const symbol = isNegative ? "" : "+"; // Añadir el símbolo "+" solo para valores positivos
  const progressValue = percentage < 0 ? 0 : percentage > 100 ? 100 : percentage; // Limitar valores entre 0 y 100

  return (
    <Card
      className={`x-chunk ${className} shadow-md transition-transform hover:scale-[1.02] cursor-pointer rounded-lg`}
    >
      <CardHeader className="pb-3 flex flex-col gap-1">
        <CardDescription className="text-gray-500 font-medium">{description}</CardDescription>
        <CardTitle className="text-3xl font-bold text-gray-900">${earnings.toLocaleString()}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 pb-4 flex items-center gap-2">
        <Badge
          className={`${isNegative ? "bg-red-500 text-white hover:bg-red-500/50 hover:text-black" : "bg-customGreen text-black hover:bg-customGreen/50"} 
          p-2 rounded-full flex items-center justify-center`}
        >
          {isNegative ? (
            <TrendingDownIcon strokeWidth={2} className="h-4 w-4" />
          ) : (
            <TrendingUpIcon strokeWidth={2} className="h-4 w-4" />
          )}
        </Badge>
        <span
          className={`text-sm font-semibold ${isNegative ? "text-red-500" : "text-customGreen"}`}
        >
          {`${symbol}${percentage}% ${content}`}
        </span>
      </CardContent>
      <CardFooter>
        <Progress
          value={progressValue}
          alert={isNegative} // Cambiar estilo si el valor es negativo
          aria-label={`${percentage}%`}
        />
      </CardFooter>
    </Card>
  );
};

export default CardSummary;
