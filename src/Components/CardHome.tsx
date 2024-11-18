import { LucideIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface CardHomeProps {
  label: string; // Etiqueta para la tarjeta (ej. "Total Revenue").
  Icon: LucideIcon; // Ícono principal para la tarjeta.
  amount: number; // Cantidad o valor principal (ej. 45231.89).
  secondaryLabel?: string; // Etiqueta secundaria (ej. "Total Orders").
  secondaryValue?: number; // Valor secundario (ej. 10234 órdenes).
  secondaryIcon?: LucideIcon; // Ícono secundario.
  percentage?: number; // Porcentaje de incremento o decremento (opcional).
  description: string; // Descripción adicional (sin porcentaje).
  showProgress?: boolean; // Mostrar barra de progreso (opcional, por defecto `true`).
  isCurrency?: boolean; // Si el valor principal es monetario (opcional, por defecto `true`).
}

const CardHome = ({
  label,
  Icon,
  amount,
  secondaryLabel,
  secondaryValue,
  secondaryIcon: SecondaryIcon,
  percentage,
  description,
  showProgress = true, // Mostrar barra de progreso por defecto
  isCurrency = true,
}: CardHomeProps) => {
  const isNegative = percentage !== undefined && percentage < 0; // Determinar si el cambio es negativo.
  const symbol = percentage !== undefined && percentage >= 0 ? "+" : ""; // Añadir el símbolo "+" solo para valores positivos.
  const progressValue =
    percentage !== undefined
      ? percentage < 0
        ? 0
        : percentage > 100
        ? 100
        : percentage
      : 0; // Limitar valores entre 0 y 100

  return (
    <Card className="border-none shadow-none h-full">
      <CardContent className="flex w-full flex-col gap-3 rounded-xl border p-5 shadow-md transition-transform hover:scale-[1.02] cursor-pointer h-full">
        {/* Sección Superior */}
        <section className="flex justify-between gap-2">
          <p className="text-gray-500 font-medium">{label}</p>
          <Icon className="h-6 w-6 text-gray-500" />
        </section>

        {/* Sección Media */}
        <section className="flex flex-col gap-4">
          <div>
          <h2 className="text-3xl font-bold text-gray-900">
              {isCurrency ? `$${amount.toLocaleString()}` : amount.toLocaleString()}
            </h2>
            {percentage !== undefined && (
              <div className="flex items-center gap-2 mt-1">
                {/* Badge Dinámico */}
                <Badge
                  className={`${
                    isNegative
                      ? "bg-red-500 text-white hover:bg-red-500/50"
                      : "bg-customGreen text-black hover:bg-customGreen/50"
                  } p-2 rounded-full flex items-center justify-center`}
                >
                  {isNegative ? (
                    <TrendingDownIcon strokeWidth={2} className="h-4 w-4" />
                  ) : (
                    <TrendingUpIcon strokeWidth={2} className="h-4 w-4" />
                  )}
                </Badge>
                <span
                  className={`text-sm font-semibold ${
                    isNegative ? "text-red-500" : "text-customGreen"
                  }`}
                >
                  {`${symbol}${percentage}% ${description}`}
                </span>
              </div>
            )}
          </div>

          {/* Información secundaria */}
          {secondaryLabel && secondaryValue !== undefined && (
            <div className="flex items-center justify-between bg-customGreen/15 p-3 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">{secondaryLabel}</p>
                <h3 className="text-lg font-bold text-gray-900">
                  {secondaryValue.toLocaleString()}
                </h3>
              </div>
              {SecondaryIcon && (
                <SecondaryIcon className="h-6 w-6 text-slate-500" />
              )}
            </div>
          )}
        </section>

        {/* Barra de Progreso o Relleno */}
        {showProgress && percentage !== undefined ? (
          <section className="mt-4">
            <Progress
              value={progressValue}
              alert={isNegative} // Cambiar estilo si el valor es negativo
              aria-label={`${percentage}%`}
              className="h-2 w-full rounded-lg"
            />
          </section>
        ) : (<></>)}
      </CardContent>
    </Card>
  );
};

export default CardHome;
