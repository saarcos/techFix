import { LucideIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface CardHomeProps {
  label: string; // Etiqueta para la tarjeta (ej. "Total Revenue").
  Icon: LucideIcon; // Ícono principal para la tarjeta.
  amount: number; // Cantidad o valor principal (ej. 45231.89).
  percentage: number; // Porcentaje de incremento o decremento.
  description: string; // Descripción adicional (sin porcentaje).
}

const CardHome = ({ label, Icon, amount, percentage, description }: CardHomeProps) => {
  const isNegative = percentage < 0; // Determinar si el cambio es negativo.
  const symbol = isNegative ? "" : "+"; // Añadir el símbolo "+" solo para valores positivos.

  return (
    <CardContent className="flex w-full flex-col gap-3 rounded-xl border p-5 shadow-md transition-transform hover:scale-[1.02] cursor-pointer">
      {/* Sección Superior */}
      <section className="flex justify-between gap-2">
        <p className="text-gray-500 font-medium">{label}</p>
        <Icon className="h-5 w-5 text-gray-500" />
      </section>

      {/* Sección Media */}
      <section className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-gray-900 pb-1">${amount.toLocaleString()}</h2>
        <div className="flex items-center gap-2">
          {/* Badge Dinámico */}
          <Badge
            className={`${
              isNegative ? "bg-red-500 text-white hover:bg-red-500/50" : "bg-customGreen text-black hover:bg-customGreen/50"
            } p-2 rounded-full flex items-center justify-center`}
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
            {`${symbol}${percentage}% ${description}`}
          </span>
        </div>
      </section>
    </CardContent>
  );
};

export default CardHome;
