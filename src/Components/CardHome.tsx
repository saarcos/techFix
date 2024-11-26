import {  LucideIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface CardHomeProps {
  label: string;
  Icon: LucideIcon;
  amount: number;
  secondaryLabel?: string;
  secondaryValue?: number;
  secondaryIcon?: LucideIcon;
  percentage?: number;
  description: string;
  showProgress?: boolean;
  isCurrency?: boolean;
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
  showProgress = true,
  isCurrency = true,
}: CardHomeProps) => {
  const navigate = useNavigate();
  const isNegative = percentage !== undefined && percentage < 0;
  const symbol = percentage !== undefined && percentage >= 0 ? "+" : "";
  const progressValue =
    percentage !== undefined
      ? percentage < 0
        ? 0
        : percentage > 100
          ? 100
          : percentage
      : 0;

  return (
    <Card className="border-none shadow-lg h-full flex-grow bg-gradient-to-br from-white to-gray-50 hover:from-gray-100">
      <CardContent className="relative flex w-full flex-col gap-4 rounded-xl border p-6 shadow-md cursor-pointer h-full">
        {/* Ícono de Fondo */}
        <Icon className="absolute right-4 top-4 text-gray-200 opacity-20 w-16 h-16" />

        {/* Sección Superior */}
        <section className="flex justify-between items-center">
          <p className="text-gray-700 font-medium text-lg">{label}</p>
          <Icon className="h-6 w-6 text-gray-500" />
        </section>

        {/* Sección Media */}
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isCurrency ? `$${amount.toLocaleString()}` : amount.toLocaleString()}
            </h2>
            {percentage !== undefined && (
              <div className="flex items-center gap-2 mt-5">
                <Badge
                  className={`${isNegative
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
                  className={`text-sm font-semibold ${isNegative ? "text-red-500" : "text-customGreen"
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
                <p className="text-sm text-gray-700">{secondaryLabel}</p>
                <h3 className="text-lg font-bold text-gray-900">
                  {secondaryValue.toLocaleString()}
                </h3>
              </div>
              {SecondaryIcon && (
                <SecondaryIcon className="h-6 w-6 text-gray-500" />
              )}
            </div>
          )}
        </section>

        {/* Área de Tendencias */}
        {showProgress && percentage !== undefined ? (
          <section className="mt-1 pt-3 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Tendencia</h3>
            <Progress
              value={progressValue}
              alert={isNegative}
              aria-label={`${percentage}%`}
              className="h-5 w-full rounded-lg" // Incrementamos el alto
            />
          </section>
        ) : (
          <section className="flex justify-center mt-2">
            <Button
              onClick={() => navigate("/taller/ordenes")}
              className="w-full bg-customGreen text-black px-4 rounded-xl shadow-sm text-sm font-medium hover:bg-customGreen/90 transition-all flex items-center gap-1 justify-center"
            >
              Ver Órdenes de Trabajo
            </Button>
          </section>
        )}
      </CardContent>
    </Card>
  );
};

export default CardHome;
